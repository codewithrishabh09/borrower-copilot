import type { BorrowerProfile } from "../types/borrower";

import {
  calculateAffordableLoanAmount,
  calculateEmi,
} from "./emiCalculator";

import {
  calculateEffectiveApr,
} from "./aprCalculator";

import {
  calculateUsableIncome,
  type IncomeCalculationResult,
} from "./incomeCalculator";

import {
  calculateProfileAffordability,
  type AffordabilityResult,
} from "./affordabilityCalculator";

import {
  runStressTest,
  type StressTestResult,
} from "./stressTest";

import {
  calculateBorrowingDecision,
  type BorrowingDecisionResult,
} from "../rules/borrowingDecision";

import {
  calculateEligibility,
  type EligibilityResult,
} from "../rules/eligibility";

import {
  calculateInterestRate,
  type InterestRateResult,
} from "../rules/interestRate";

import {
  generateNegotiationStrategy,
  type NegotiationResult,
} from "../rules/negotiation";

import {
  getLoanProduct,
} from "../data/loanProducts";

export interface BorrowerAnalysisResult {
  profile: BorrowerProfile;

  income: IncomeCalculationResult;

  affordability: AffordabilityResult;

  eligibility: EligibilityResult;

  interestRate: InterestRateResult;

  negotiation: NegotiationResult;

  requestedLoan: {
    amount: number;

    interestRate: number;

    tenureMonths: number;

    monthlyEmi: number;
  };

  affordableLoanAmount: number;

  /*
   * Gold Loan assessment details.
   *
   * Null for all non-gold loan purposes.
   */
  goldLoan: {
    estimatedGoldValue: number;

    conservativeLtvPercentage: number;

    maxLoanByGoldValue: number;
  } | null;

  apr: {
    processingFee: number;

    netDisbursedAmount: number;

    totalPayment: number;

    totalInterest: number;

    estimatedApr: number;
  };

  stressTest: StressTestResult;

  decision: BorrowingDecisionResult;
}

export function analyzeBorrower(
  profile: BorrowerProfile,
): BorrowerAnalysisResult {
  /*
   * ==================================
   * 1. LOAN PRODUCT
   * ==================================
   */

  const loanProduct = getLoanProduct(
    profile.loanPurpose,
  );

  const requestedLoanAmount =
    profile.requestedAmount ?? 0;

  const tenureMonths =
    loanProduct.tenureMonths;

  const processingFeePercentage =
    loanProduct.processingFeePercentage;

  /*
   * ==================================
   * 2. INTEREST RATE RANGE
   * ==================================
   */

  const interestRate =
    calculateInterestRate({
      profile,
    });

  /*
   * Midpoint of fair rate range is used
   * for EMI and APR calculations.
   */

  const annualInterestRate =
    Number(
      (
        (interestRate.fairRateMin +
          interestRate.fairRateMax) /
        2
      ).toFixed(2),
    );

  /*
   * ==================================
   * 3. NORMALIZE INCOME
   * ==================================
   */

  const income =
    calculateUsableIncome(profile);

  /*
   * ==================================
   * 4. BORROWER AFFORDABILITY
   * ==================================
   */

  const affordability =
    calculateProfileAffordability(
      profile,
      income.usableMonthlyIncome,
    );

  /*
   * ==================================
   * 5. REQUESTED EMI
   * ==================================
   */

  const requestedEmiResult =
    calculateEmi({
      principal: requestedLoanAmount,
      annualInterestRate,
      tenureMonths,
    });

  /*
   * ==================================
   * 6. AFFORDABILITY-BASED LOAN LIMIT
   * ==================================
   */

  const affordabilityBasedLoanAmount =
    calculateAffordableLoanAmount(
      affordability.safeMonthlyEmi,
      annualInterestRate,
      tenureMonths,
    );

  /*
   * ==================================
   * 7. GOLD LOAN LTV LIMIT
   * ==================================
   *
   * We use a conservative internal 70%
   * of estimated gold value for this
   * educational assessment.
   */

  const goldLoan =
    profile.loanPurpose === "gold"
      ? {
          estimatedGoldValue:
            profile.goldEstimatedValue ?? 0,

          conservativeLtvPercentage: 70,

          maxLoanByGoldValue: Math.round(
            (profile.goldEstimatedValue ?? 0) * 0.7,
          ),
        }
      : null;

  /*
   * The Gold Loan safe amount cannot
   * exceed both:
   *
   * 1. Income affordability limit
   * 2. Conservative gold-value limit
   */

  const affordableLoanAmount =
    goldLoan
      ? Math.min(
          affordabilityBasedLoanAmount,
          goldLoan.maxLoanByGoldValue,
        )
      : affordabilityBasedLoanAmount;

  /*
   * ==================================
   * 8. LENDER ELIGIBILITY
   * ==================================
   */

  const eligibility =
    calculateEligibility({
      profile,
      affordableLoanAmount,
    });

  /*
   * ==================================
   * 9. ALL-IN APR
   * ==================================
   */

  const aprResult =
    calculateEffectiveApr({
      principal: requestedLoanAmount,

      annualInterestRate,

      tenureMonths,

      processingFeePercentage,
    });

  /*
   * ==================================
   * 10. STRESS TEST
   * ==================================
   */

  const stressTest =
    runStressTest({
      monthlyIncome:
        income.usableMonthlyIncome,

      monthlyEmi:
        requestedEmiResult.monthlyEmi,

      safeEmiPercentage:
        affordability.safetyAdjustmentPercentage,
    });

  /*
   * ==================================
   * 11. FINAL BORROWING DECISION
   * ==================================
   */

  const decision =
    calculateBorrowingDecision({
      requestedLoanAmount,

      affordableLoanAmount,

      safeMonthlyEmi:
        affordability.safeMonthlyEmi,

      requestedMonthlyEmi:
        requestedEmiResult.monthlyEmi,

      creditScore:
        profile.creditScore,

      hasRecentMissedPayment:
        profile.recentMissedPayment ?? false,

      incomeReliability:
        income.incomeReliability,

      stressTestPassed:
        stressTest.worstCaseAffordable,
    });

  /*
   * ==================================
   * 12. NEGOTIATION STRATEGY
   * ==================================
   */

  const negotiation =
    generateNegotiationStrategy({
      profile,

      decision,

      affordableLoanAmount,

      likelySanctionAmount:
        eligibility.likelySanctionAmount,

      fairRateMin:
        interestRate.fairRateMin,

      fairRateMax:
        interestRate.fairRateMax,

      safeMonthlyEmi:
        affordability.safeMonthlyEmi,

      requestedMonthlyEmi:
        requestedEmiResult.monthlyEmi,
    });

  return {
    profile,

    income,

    affordability,

    eligibility,

    interestRate,

    negotiation,

    requestedLoan: {
      amount: requestedLoanAmount,

      interestRate:
        annualInterestRate,

      tenureMonths,

      monthlyEmi:
        requestedEmiResult.monthlyEmi,
    },

    affordableLoanAmount:
      Math.round(affordableLoanAmount),

    goldLoan,

    apr: {
      processingFee:
        aprResult.processingFee,

      netDisbursedAmount:
        aprResult.netDisbursedAmount,

      totalPayment:
        aprResult.totalPayment,

      totalInterest:
        aprResult.totalInterest,

      estimatedApr:
        aprResult.estimatedApr,
    },

    stressTest,

    decision,
  };
}