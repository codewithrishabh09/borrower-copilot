export type BorrowingRecommendation =
  | "BORROW"
  | "BORROW_LESS"
  | "DO_NOT_BORROW";

export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface BorrowingDecisionInput {
  requestedLoanAmount: number;
  affordableLoanAmount: number;

  safeMonthlyEmi: number;
  requestedMonthlyEmi: number;

  creditScore?: number;

  hasRecentMissedPayment?: boolean;

  incomeReliability:
    | "high"
    | "medium"
    | "low";

  stressTestPassed: boolean;
}

export interface BorrowingDecisionResult {
  recommendation: BorrowingRecommendation;

  riskLevel: RiskLevel;

  confidenceScore: number;

  recommendedLoanAmount: number;

  loanDifference: number;

  reasons: string[];

  warnings: string[];
}

/**
 * Generates a borrowing recommendation using:
 *
 * - Loan affordability
 * - EMI affordability
 * - Credit risk
 * - Payment history
 * - Income reliability
 * - Income stress testing
 */
export function calculateBorrowingDecision({
  requestedLoanAmount,
  affordableLoanAmount,
  safeMonthlyEmi,
  requestedMonthlyEmi,
  creditScore,
  hasRecentMissedPayment = false,
  incomeReliability,
  stressTestPassed,
}: BorrowingDecisionInput): BorrowingDecisionResult {
  if (requestedLoanAmount <= 0) {
    throw new Error(
      "Requested loan amount must be greater than zero.",
    );
  }

  if (affordableLoanAmount < 0) {
    throw new Error(
      "Affordable loan amount cannot be negative.",
    );
  }

  if (safeMonthlyEmi < 0) {
    throw new Error(
      "Safe monthly EMI cannot be negative.",
    );
  }

  if (requestedMonthlyEmi < 0) {
    throw new Error(
      "Requested monthly EMI cannot be negative.",
    );
  }

  const reasons: string[] = [];
  const warnings: string[] = [];

  let riskScore = 0;

  /*
   * ==========================
   * LOAN AFFORDABILITY
   * ==========================
   */

  const loanAmountAffordable =
    requestedLoanAmount <= affordableLoanAmount;

  const emiAffordable =
    requestedMonthlyEmi <= safeMonthlyEmi;

  if (loanAmountAffordable && emiAffordable) {
    reasons.push(
      "The requested loan amount and EMI are within the calculated affordability limits.",
    );
  } else {
    riskScore += 3;

    warnings.push(
      "The requested borrowing amount or monthly EMI exceeds your calculated safe limit.",
    );
  }

  /*
   * ==========================
   * CREDIT RISK
   * ==========================
   */

  if (creditScore !== undefined) {
    if (creditScore < 550) {
      riskScore += 3;

      warnings.push(
        "Your reported credit score indicates elevated credit risk.",
      );
    } else if (creditScore < 650) {
      riskScore += 2;

      warnings.push(
        "Your credit score may limit the interest rates or loan terms available to you.",
      );
    } else if (creditScore < 750) {
      riskScore += 1;

      reasons.push(
        "Your credit score appears to be within a moderate range.",
      );
    } else {
      reasons.push(
        "Your credit score indicates relatively strong repayment history.",
      );
    }
  } else {
    riskScore += 1;

    warnings.push(
      "Credit score information was unavailable, so the recommendation has lower confidence.",
    );
  }

  /*
   * ==========================
   * MISSED PAYMENTS
   * ==========================
   */

  if (hasRecentMissedPayment) {
    riskScore += 3;

    warnings.push(
      "A recent missed payment can increase repayment risk and affect loan pricing.",
    );
  }

  /*
   * ==========================
   * INCOME RELIABILITY
   * ==========================
   */

  if (incomeReliability === "low") {
    riskScore += 2;

    warnings.push(
      "Your income appears variable, so the recommendation uses a more conservative risk approach.",
    );
  } else if (incomeReliability === "medium") {
    riskScore += 1;

    warnings.push(
      "Your income estimate has moderate reliability.",
    );
  } else {
    reasons.push(
      "Your income appears relatively stable based on the information provided.",
    );
  }

  /*
   * ==========================
   * STRESS TEST
   * ==========================
   */

  if (!stressTestPassed) {
    riskScore += 2;

    warnings.push(
      "The proposed EMI did not remain affordable in one or more income stress scenarios.",
    );
  } else {
    reasons.push(
      "The proposed EMI remained within the affordability threshold during the tested income stress scenarios.",
    );
  }

  /*
   * ==========================
   * FINAL RECOMMENDATION
   * ==========================
   *
   * Important rule:
   *
   * A borrower should NOT receive a direct BORROW
   * recommendation if the stress test fails.
   */

  let recommendation: BorrowingRecommendation;

  /*
   * Very high risk or no affordability.
   */
  if (
    affordableLoanAmount <= 0 ||
    safeMonthlyEmi <= 0 ||
    riskScore >= 7
  ) {
    recommendation = "DO_NOT_BORROW";
  }

  /*
   * Requested loan exceeds affordability.
   */
  else if (
    !loanAmountAffordable ||
    !emiAffordable
  ) {
    recommendation = "BORROW_LESS";
  }

  /*
   * Even when the requested loan is affordable,
   * failing the stress test prevents a direct
   * BORROW recommendation.
   */
  else if (!stressTestPassed) {
    recommendation = "BORROW_LESS";
  }

  /*
   * Medium risk.
   */
  else if (riskScore >= 4) {
    recommendation = "BORROW_LESS";
  }

  /*
   * Low risk + affordable + stress test passed.
   */
  else {
    recommendation = "BORROW";
  }

  /*
   * ==========================
   * RECOMMENDED LOAN AMOUNT
   * ==========================
   */

  let recommendedLoanAmount =
    Math.max(
      Math.min(
        requestedLoanAmount,
        affordableLoanAmount,
      ),
      0,
    );

  /*
   * If the stress test fails, recommend
   * a more conservative borrowing amount.
   */
  if (!stressTestPassed) {
    recommendedLoanAmount =
      Math.min(
        recommendedLoanAmount,
        requestedLoanAmount * 0.8,
      );
  }

  /*
   * If the recommendation is DO_NOT_BORROW,
   * no additional borrowing is recommended.
   */
  if (recommendation === "DO_NOT_BORROW") {
    recommendedLoanAmount = 0;
  }

  const loanDifference =
    Math.max(
      requestedLoanAmount -
        recommendedLoanAmount,
      0,
    );

  /*
   * ==========================
   * CONFIDENCE SCORE
   * ==========================
   */

  const confidenceScore =
    Math.max(
      100 - riskScore * 12,
      20,
    );

  /*
   * ==========================
   * RISK LEVEL
   * ==========================
   */

  let riskLevel: RiskLevel;

  if (riskScore >= 7) {
    riskLevel = "HIGH";
  } else if (riskScore >= 4) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  return {
    recommendation,

    riskLevel,

    confidenceScore,

    recommendedLoanAmount:
      Math.round(recommendedLoanAmount),

    loanDifference:
      Math.round(loanDifference),

    reasons,

    warnings,
  };
}