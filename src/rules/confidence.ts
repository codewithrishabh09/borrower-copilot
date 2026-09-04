export interface ConfidenceInput {
  riskScore: number;

  hasCreditScore: boolean;

  incomeReliability:
    | "high"
    | "medium"
    | "low";

  hasRecentMissedPayment: boolean;

  stressTestPassed: boolean;
}

export interface ConfidenceResult {
  confidenceScore: number;

  factors: string[];
}

/**
 * Calculates how confident the system is
 * in the borrowing recommendation.
 *
 * Confidence represents how complete and
 * consistent the borrower information is.
 */
export function calculateConfidence({
  riskScore,
  hasCreditScore,
  incomeReliability,
  hasRecentMissedPayment,
  stressTestPassed,
}: ConfidenceInput): ConfidenceResult {
  let confidenceScore = 100;

  const factors: string[] = [];

  /*
   * ==========================
   * RISK SCORE
   * ==========================
   */

  confidenceScore -= riskScore * 8;

  /*
   * ==========================
   * CREDIT INFORMATION
   * ==========================
   */

  if (!hasCreditScore) {
    confidenceScore -= 10;

    factors.push(
      "Credit score information is unavailable.",
    );
  }

  /*
   * ==========================
   * INCOME RELIABILITY
   * ==========================
   */

  if (incomeReliability === "medium") {
    confidenceScore -= 5;

    factors.push(
      "Income reliability is moderate.",
    );
  }

  if (incomeReliability === "low") {
    confidenceScore -= 12;

    factors.push(
      "Income reliability is low or variable.",
    );
  }

  /*
   * ==========================
   * REPAYMENT HISTORY
   * ==========================
   */

  if (hasRecentMissedPayment) {
    confidenceScore -= 8;

    factors.push(
      "Recent missed payments increase uncertainty.",
    );
  }

  /*
   * ==========================
   * STRESS TEST
   * ==========================
   */

  if (!stressTestPassed) {
    confidenceScore -= 10;

    factors.push(
      "The requested EMI did not pass all stress scenarios.",
    );
  }

  /*
   * ==========================
   * FINAL BOUNDS
   * ==========================
   */

  confidenceScore = Math.max(
    20,
    Math.min(
      Math.round(confidenceScore),
      100,
    ),
  );

  return {
    confidenceScore,
    factors,
  };
}