import type { BorrowerAnalysisResult } from "./borrowerAnalyzer";

export type RecommendationPriority =
  | "high"
  | "medium"
  | "low";

export interface BorrowerRecommendation {
  id: string;
  priority: RecommendationPriority;
  title: string;
  description: string;
}

export interface RecommendationResult {
  recommendations: BorrowerRecommendation[];
}

/**
 * Generates actionable recommendations based on
 * the complete borrower analysis.
 */
export function generateRecommendations(
  analysis: BorrowerAnalysisResult,
): RecommendationResult {
  const recommendations: BorrowerRecommendation[] = [];

  const {
    requestedLoan,
    affordability,
    decision,
    stressTest,
    income,
    apr,
  } = analysis;

  /*
   * ==================================
   * 1. LOAN AMOUNT REDUCTION
   * ==================================
   */

  if (
    decision.recommendedLoanAmount <
    requestedLoan.amount
  ) {
    const amountToReduce =
      requestedLoan.amount -
      decision.recommendedLoanAmount;

    recommendations.push({
      id: "reduce-loan",
      priority: "high",
      title: "Consider borrowing less",
      description:
        `Your requested amount is above the calculated affordability limit. ` +
        `Consider reducing your borrowing by ₹${Math.round(
          amountToReduce,
        ).toLocaleString("en-IN")}.`,
    });
  }

  /*
   * ==================================
   * 2. EMI REDUCTION
   * ==================================
   */

  if (
    requestedLoan.monthlyEmi >
    affordability.safeMonthlyEmi
  ) {
    const emiDifference =
      requestedLoan.monthlyEmi -
      affordability.safeMonthlyEmi;

    recommendations.push({
      id: "reduce-emi",
      priority: "high",
      title: "Reduce your monthly EMI pressure",
      description:
        `Your current EMI is ₹${Math.round(
          emiDifference,
        ).toLocaleString(
          "en-IN",
        )} above your calculated safe monthly limit. ` +
        `Consider reducing the loan amount or extending the repayment tenure.`,
    });
  }

  /*
   * ==================================
   * 3. STRESS TEST
   * ==================================
   */

  if (!stressTest.worstCaseAffordable) {
    recommendations.push({
      id: "income-stress",
      priority: "high",
      title: "Build a buffer for income changes",
      description:
        "Your proposed EMI did not remain affordable in all tested income-drop scenarios. Consider keeping a larger monthly buffer before taking this loan.",
    });
  }

  /*
   * ==================================
   * 4. EMERGENCY SAVINGS
   * ==================================
   */

  const savingsMonths =
    analysis.profile.emergencySavingsMonths ?? 0;

  if (savingsMonths < 3) {
    recommendations.push({
      id: "emergency-savings",
      priority: "medium",
      title: "Strengthen your emergency savings",
      description:
        "You currently have less than three months of emergency savings. Building a larger buffer may reduce financial pressure during unexpected events.",
    });
  }

  /*
   * ==================================
   * 5. INCOME RELIABILITY
   * ==================================
   */

  if (income.incomeReliability === "low") {
    recommendations.push({
      id: "income-stability",
      priority: "medium",
      title: "Plan conservatively for variable income",
      description:
        "Your income appears variable. Consider basing your repayment plan on your lower typical income rather than your highest earning months.",
    });
  }

  /*
   * ==================================
   * 6. APR / PROCESSING COST
   * ==================================
   */

  if (
    apr.estimatedApr >
    requestedLoan.interestRate + 1
  ) {
    recommendations.push({
      id: "compare-apr",
      priority: "low",
      title: "Compare the effective borrowing cost",
      description:
        "Processing fees increase your effective borrowing cost. Compare APR and total repayment cost instead of looking only at the advertised interest rate.",
    });
  }

  /*
   * ==================================
   * DEFAULT POSITIVE RECOMMENDATION
   * ==================================
   */

  if (recommendations.length === 0) {
    recommendations.push({
      id: "maintain-buffer",
      priority: "low",
      title: "Maintain your financial buffer",
      description:
        "Your current borrowing request appears to fit within the calculated affordability limits. Continue maintaining savings for unexpected expenses.",
    });
  }

  return {
    recommendations,
  };
}