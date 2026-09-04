import type {
  BorrowerProfile,
} from "../types/borrower";

import {
  getLoanProduct,
} from "../data/loanProducts";

export interface InterestRateResult {
  fairRateMin: number;

  fairRateMax: number;

  reasons: string[];

  warnings: string[];
}

interface InterestRateInput {
  profile: BorrowerProfile;
}

export function calculateInterestRate({
  profile,
}: InterestRateInput): InterestRateResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  /*
   * ==================================
   * LOAN PRODUCT BASE RATE
   * ==================================
   */

  const loanProduct = getLoanProduct(
    profile.loanPurpose,
  );

  const baseRate =
    loanProduct.annualInterestRate;

  /*
   * Start with a range around the
   * loan product's configured base rate.
   */
  let fairRateMin =
    baseRate - 2;

  let fairRateMax =
    baseRate + 3;

  reasons.push(
    `${loanProduct.label} borrowing is evaluated using its configured base interest rate.`,
  );

  /*
   * ==================================
   * CREDIT SCORE
   * ==================================
   */

  if (
    profile.creditScoreStatus === "unknown" ||
    profile.creditScore === undefined
  ) {
    fairRateMin += 1;

    fairRateMax += 2;

    warnings.push(
      "Your credit score is unknown, so the estimated rate range is wider.",
    );
  } else if (profile.creditScore < 550) {
    fairRateMin += 3;

    fairRateMax += 5;

    warnings.push(
      "Higher credit risk may result in more expensive borrowing.",
    );
  } else if (profile.creditScore < 650) {
    fairRateMin += 2;

    fairRateMax += 3;

    warnings.push(
      "Your credit profile may lead to a higher borrowing rate.",
    );
  } else if (profile.creditScore >= 750) {
    fairRateMin -= 0.5;

    fairRateMax -= 1;

    reasons.push(
      "A strong credit profile may help you qualify for better loan pricing.",
    );
  } else {
    reasons.push(
      "Your credit profile is within a moderate range for loan pricing.",
    );
  }

  /*
   * ==================================
   * MISSED PAYMENTS
   * ==================================
   */

  if (profile.recentMissedPayment) {
    fairRateMin += 1;

    fairRateMax += 2;

    warnings.push(
      "Recent missed payments may increase the interest rate offered.",
    );
  }

  /*
   * ==================================
   * INCOME TYPE
   * ==================================
   */

  if (profile.incomeType === "informal") {
    fairRateMin += 1;

    fairRateMax += 2;

    warnings.push(
      "Informal income may lead lenders to use more conservative pricing.",
    );
  }

  if (
    profile.incomeType === "self_employed" &&
    profile.businessYears !== undefined &&
    profile.businessYears >= 3
  ) {
    fairRateMin -= 0.25;

    reasons.push(
      "An established business history may support more competitive pricing.",
    );
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
    fairRateMin -= 0.5;

    fairRateMax -= 1;

    reasons.push(
      "Collateral may make lower-cost secured borrowing available.",
    );
  }

  /*
   * ==================================
   * SAFETY BOUNDS
   * ==================================
   */

  fairRateMin = Math.max(
    5,
    Number(fairRateMin.toFixed(2)),
  );

  fairRateMax = Math.max(
    fairRateMin + 1,
    Number(fairRateMax.toFixed(2)),
  );

  return {
    fairRateMin,
    fairRateMax,
    reasons,
    warnings,
  };
}