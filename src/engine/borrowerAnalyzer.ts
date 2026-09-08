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


/* ==================================
   GOLD LOAN TYPES
================================== */

export type GoldLoanLimitingFactor =
  | "gold_value"
  | "monthly_affordability"
  | "both";


export interface GoldLoanAssessment {
  estimatedGoldValue: number;

  conservativeLtvPercentage: number;

  maxLoanByGoldValue: number;

  affordabilityBasedLoanAmount: number;

  finalSafeAmount: number;

  limitingFactor: GoldLoanLimitingFactor;
}


/* ==================================
   MAIN RESULT TYPE
================================== */

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

  /**
   * Gold Loan assessment details.
   *
   * Null for all non-gold loan purposes.
   */
  goldLoan: GoldLoanAssessment | null;

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


/* ==================================
   MAIN ANALYZER
================================== */

export function analyzeBorrower(
  profile: BorrowerProfile,
): BorrowerAnalysisResult {

  /* ==================================
     1. LOAN PRODUCT
  ================================== */

  const loanProduct = getLoanProduct(
    profile.loanPurpose,
  );

  const requestedLoanAmount =
    profile.requestedAmount ?? 0;

  const tenureMonths =
    loanProduct.tenureMonths;

  const processingFeePercentage =
    loanProduct.processingFeePercentage;


  /* ==================================
     2. INTEREST RATE
  ================================== */

  const interestRate =
    calculateInterestRate({
      profile,
    });

  const annualInterestRate =
    Number(
      (
        (
          interestRate.fairRateMin +
          interestRate.fairRateMax
        ) / 2
      ).toFixed(2),
    );


  /* ==================================
     3. NORMALIZE INCOME
  ================================== */

  const income =
    calculateUsableIncome(profile);


  /* ==================================
     4. BORROWER AFFORDABILITY
  ================================== */

  const affordability =
    calculateProfileAffordability(
      profile,
      income.usableMonthlyIncome,
    );


  /* ==================================
     5. REQUESTED EMI
  ================================== */

  const requestedEmiResult =
    calculateEmi({
      principal: requestedLoanAmount,
      annualInterestRate,
      tenureMonths,
    });


  /* ==================================
     6. AFFORDABILITY-BASED LIMIT
  ================================== */

  const affordabilityBasedLoanAmount =
    Math.round(
      calculateAffordableLoanAmount(
        affordability.safeMonthlyEmi,
        annualInterestRate,
        tenureMonths,
      ),
    );


  /* ==================================
     7. GOLD LOAN LIMIT
  ==================================

     For Gold Loans, we use a
     conservative internal LTV of 70%.

     Final safe amount is limited by:

     1. Monthly affordability
     2. Gold-backed borrowing capacity
  ================================== */

  let goldLoan: GoldLoanAssessment | null =
    null;

  if (profile.loanPurpose === "gold") {

    const estimatedGoldValue =
      Math.max(
        0,
        profile.goldEstimatedValue ?? 0,
      );

    const conservativeLtvPercentage =
      70;

    const maxLoanByGoldValue =
      Math.round(
        estimatedGoldValue *
          (conservativeLtvPercentage / 100),
      );

    const finalSafeAmount =
      Math.min(
        affordabilityBasedLoanAmount,
        maxLoanByGoldValue,
      );

    let limitingFactor: GoldLoanLimitingFactor;

    if (
      affordabilityBasedLoanAmount ===
      maxLoanByGoldValue
    ) {
      limitingFactor = "both";
    } else if (
      maxLoanByGoldValue <
      affordabilityBasedLoanAmount
    ) {
      limitingFactor = "gold_value";
    } else {
      limitingFactor =
        "monthly_affordability";
    }

    goldLoan = {
      estimatedGoldValue,

      conservativeLtvPercentage,

      maxLoanByGoldValue,

      affordabilityBasedLoanAmount,

      finalSafeAmount,

      limitingFactor,
    };
  }


  /* ==================================
     8. FINAL SAFE LOAN AMOUNT
  ================================== */

  const affordableLoanAmount =
    goldLoan
      ? goldLoan.finalSafeAmount
      : affordabilityBasedLoanAmount;


  /* ==================================
     9. LENDER ELIGIBILITY
  ================================== */

  const eligibility =
    calculateEligibility({
      profile,
      affordableLoanAmount,
    });


  /* ==================================
     10. APR CALCULATION
  ================================== */

  const aprResult =
    calculateEffectiveApr({
      principal: requestedLoanAmount,
      annualInterestRate,
      tenureMonths,
      processingFeePercentage,
    });


  /* ==================================
     11. STRESS TEST
  ================================== */

  const stressTest =
    runStressTest({
      monthlyIncome:
        income.usableMonthlyIncome,

      monthlyEmi:
        requestedEmiResult.monthlyEmi,

      safeEmiPercentage:
        affordability.safetyAdjustmentPercentage,
    });


  /* ==================================
     12. FINAL BORROWING DECISION
  ================================== */

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


  /* ==================================
     13. NEGOTIATION STRATEGY
  ================================== */

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


  /* ==================================
     14. RETURN FINAL ANALYSIS
  ================================== */

  return {
    profile,

    income,

    affordability,

    eligibility,

    interestRate,

    negotiation,

    requestedLoan: {
      amount: requestedLoanAmount,

      interestRate: annualInterestRate,

      tenureMonths,

      monthlyEmi:
        requestedEmiResult.monthlyEmi,
    },

    affordableLoanAmount:
      Math.round(
        affordableLoanAmount,
      ),

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