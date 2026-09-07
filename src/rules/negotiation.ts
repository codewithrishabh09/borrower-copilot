import type { BorrowerProfile } from "../types/borrower";

import type {
  BorrowingDecisionResult,
} from "./borrowingDecision";

export interface NegotiationSuggestion {
  title: string;

  description: string;

  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface NegotiationResult {
  headline: string;

  summary: string;

  suggestions: NegotiationSuggestion[];
}

interface NegotiationInput {
  profile: BorrowerProfile;

  decision: BorrowingDecisionResult;

  affordableLoanAmount: number;

  likelySanctionAmount: number;

  fairRateMin: number;

  fairRateMax: number;

  safeMonthlyEmi: number;

  requestedMonthlyEmi: number;
}

/**
 * Generates actionable suggestions for the borrower.
 *
 * This does not decide whether the borrower should
 * borrow. It explains what actions may improve the
 * borrowing situation or loan terms.
 */
export function generateNegotiationStrategy({
  profile,
  decision,
  affordableLoanAmount,
  likelySanctionAmount,
  fairRateMin,
  fairRateMax,
  safeMonthlyEmi,
  requestedMonthlyEmi,
}: NegotiationInput): NegotiationResult {
  const suggestions: NegotiationSuggestion[] = [];

  /*
   * ==================================
   * BORROW LESS
   * ==================================
   */

  if (
    decision.recommendation === "BORROW_LESS" &&
    affordableLoanAmount > 0
  ) {
    suggestions.push({
      title: "Reduce the requested amount",
      description:
        `Consider reducing your borrowing closer to ₹${Math.round(
          affordableLoanAmount,
        ).toLocaleString("en-IN")}. This is closer to your calculated affordability limit.`,
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * DO NOT BORROW
   * ==================================
   */

  if (decision.recommendation === "DO_NOT_BORROW") {
    suggestions.push({
      title: "Avoid taking additional debt right now",
      description:
        "The current assessment indicates significant affordability or repayment risk. Consider improving income stability, reducing existing obligations, or building savings before borrowing.",
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * EMI PRESSURE
   * ==================================
   */

  if (
    requestedMonthlyEmi > safeMonthlyEmi &&
    safeMonthlyEmi > 0
  ) {
    suggestions.push({
      title: "Lower your monthly EMI pressure",
      description:
        "A lower loan amount or a carefully chosen longer repayment period may reduce monthly repayment pressure.",
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * INTEREST RATE
   * ==================================
   */

  const rateRange =
    fairRateMax - fairRateMin;

  if (rateRange >= 2) {
    suggestions.push({
      title: "Compare loan offers",
      description:
        `Your estimated fair rate range is ${fairRateMin}% to ${fairRateMax}%. Comparing multiple lenders may help you negotiate better pricing.`,
      priority: "MEDIUM",
    });
  }

  /*
   * ==================================
   * LOAN PURPOSE STRATEGY
   * ==================================
   */

  switch (profile.loanPurpose) {
    case "home":
      suggestions.push({
        title: "Evaluate the long-term borrowing cost",
        description:
          "Home loans usually involve long repayment periods, so compare the total interest paid over the full tenure instead of focusing only on the monthly EMI.",
        priority: "MEDIUM",
      });
      break;

    case "vehicle":
      suggestions.push({
        title: "Review the total vehicle financing cost",
        description:
          "Compare the down payment, loan cost, insurance, maintenance, and monthly EMI before choosing a financing option.",
        priority: "MEDIUM",
      });
      break;

    case "business":
      suggestions.push({
        title: "Protect business cash flow",
        description:
          "Ensure the proposed EMI remains manageable even during slower business months and does not create excessive working-capital pressure.",
        priority: "HIGH",
      });
      break;

    case "education":
      suggestions.push({
        title: "Plan repayment around future income",
        description:
          "Consider how repayment will begin and whether expected future income can support the EMI after completing the education or training.",
        priority: "HIGH",
      });
      break;

    /*
     * ==================================
     * GOLD LOAN — ADDED
     * ==================================
     */

    case "gold":
      suggestions.push({
        title: "Keep the loan within your assessed gold-backed limit",
        description:
          "Avoid increasing the loan amount only because a lender is willing to offer more. Your borrowing should remain within both your affordability limit and the value-based limit of the gold you plan to pledge.",
        priority: "HIGH",
      });

      suggestions.push({
        title: "Compare gold valuation and loan-to-value",
        description:
          "Ask how the lender values your gold, what portion of that value they are willing to lend against, and how the final sanctioned amount is calculated.",
        priority: "HIGH",
      });

      suggestions.push({
        title: "Clarify auction and repayment conditions",
        description:
          "Before accepting the loan, understand the repayment due dates, overdue charges, notices, and the lender's process if the loan is not repaid on time.",
        priority: "HIGH",
      });

      break;

    case "personal":
      suggestions.push({
        title: "Review whether the expense can be reduced",
        description:
          "For unsecured personal borrowing, reducing the required amount may lower both the monthly EMI and the total borrowing cost.",
        priority: "MEDIUM",
      });
      break;

    case "other":
    default:
      suggestions.push({
        title: "Use conservative borrowing assumptions",
        description:
          "For general-purpose borrowing, focus on affordability and total repayment cost before accepting additional debt.",
        priority: "MEDIUM",
      });
      break;
  }

  /*
   * ==================================
   * COLLATERAL
   * ==================================
   */

  if (
    profile.collateralValue !== undefined &&
    profile.collateralValue > 0
  ) {
    suggestions.push({
      title: "Consider secured borrowing",
      description:
        "Available collateral may help improve lender eligibility or reduce borrowing costs compared with unsecured options.",
      priority: "MEDIUM",
    });
  }

  /*
   * ==================================
   * EXISTING GOLD LOAN — ADDED
   * ==================================
   */

  if (
    profile.loanPurpose === "gold" &&
    profile.hasExistingGoldLoan
  ) {
    suggestions.push({
      title: "Review your existing gold-backed debt first",
      description:
        "Because you already have another loan against gold, compare the total repayment pressure across both loans before accepting additional borrowing.",
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * CO-APPLICANT
   * ==================================
   */

  if (!profile.hasCoApplicant) {
    suggestions.push({
      title: "Evaluate a co-applicant carefully",
      description:
        "A financially strong co-applicant may improve eligibility in some lending situations, depending on lender policies.",
      priority: "LOW",
    });
  }

  /*
   * ==================================
   * CREDIT IMPROVEMENT
   * ==================================
   */

  if (
    profile.creditScoreStatus === "unknown" ||
    profile.creditScore === undefined
  ) {
    suggestions.push({
      title: "Check your credit profile",
      description:
        "Knowing your credit profile can help you better understand likely loan pricing and eligibility.",
      priority: "MEDIUM",
    });
  } else if (profile.creditScore < 650) {
    suggestions.push({
      title: "Improve your credit profile before borrowing",
      description:
        "Improving repayment history and reducing outstanding obligations may help you access better loan terms.",
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * MISSED PAYMENT
   * ==================================
   */

  if (profile.recentMissedPayment) {
    suggestions.push({
      title: "Stabilize repayment history",
      description:
        "Recent missed payments may affect eligibility and pricing. Maintaining consistent repayments can strengthen your future borrowing profile.",
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * LENDER VS SAFE AMOUNT
   * ==================================
   */

  if (
    likelySanctionAmount >
    affordableLoanAmount * 1.1
  ) {
    suggestions.push({
      title: "Do not borrow only because you are eligible",
      description:
        "A lender may be willing to sanction more than your calculated safe borrowing amount. Affordability should remain your primary limit.",
      priority: "HIGH",
    });
  }

  /*
   * ==================================
   * FALLBACK
   * ==================================
   */

  if (suggestions.length === 0) {
    suggestions.push({
      title: "Review the complete loan offer",
      description:
        "Before accepting a loan, review the interest rate, processing charges, repayment schedule, and total borrowing cost.",
      priority: "LOW",
    });
  }

  /*
   * ==================================
   * FINAL HEADLINE
   * ==================================
   */

  if (
    decision.recommendation === "DO_NOT_BORROW"
  ) {
    return {
      headline:
        "Focus on improving affordability first",
      summary:
        "Your current borrowing request may place significant pressure on your finances. Improving your financial position before taking additional debt may be safer.",
      suggestions,
    };
  }

  if (
    decision.recommendation === "BORROW_LESS"
  ) {
    return {
      headline:
        "A smaller loan may be more manageable",
      summary:
        "Your current request appears to be above a comfortable affordability level. Reducing the borrowing amount may improve your financial safety.",
      suggestions,
    };
  }

  if (profile.loanPurpose === "gold") {
    return {
      headline:
        "Compare valuation, borrowing cost, and repayment conditions",
      summary:
        "Your Gold Loan request appears manageable based on the information provided, but you should still compare how different lenders value your gold and explain their repayment conditions.",
      suggestions,
    };
  }

  return {
    headline:
      "Compare offers before accepting a loan",
    summary:
      "Your borrowing request appears manageable based on the provided information, but you should still compare pricing and total borrowing costs.",
    suggestions,
  };
}