import type {
  BorrowerProfile,
} from "../types/borrower";

export interface EligibilityResult {
  likelySanctionAmount: number;

  eligibilityPercentage: number;

  reasons: string[];

  warnings: string[];
}

interface EligibilityInput {
  profile: BorrowerProfile;

  affordableLoanAmount: number;
}

/**
 * Estimates the amount a lender may be
 * willing to sanction.
 *
 * This is intentionally different from
 * the borrower's safe affordability limit.
 */
export function calculateEligibility({
  profile,
  affordableLoanAmount,
}: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  let eligibilityPercentage = 100;

  /*
   * ==================================
   * LOAN PURPOSE
   * ==================================
   */

  switch (profile.loanPurpose) {
    case "home":
      reasons.push(
        "Home borrowing may offer stronger lender comfort because the loan can be structured as secured borrowing.",
      );
      break;

    case "vehicle":
      reasons.push(
        "Vehicle financing may have clearer asset-backed loan structures.",
      );
      break;

    case "education":
      reasons.push(
        "Education borrowing may be evaluated using future repayment capacity and course-related factors.",
      );
      break;

    case "business":
      eligibilityPercentage -= 5;

      warnings.push(
        "Business borrowing may require additional income and business verification.",
      );
      break;

    case "personal":
      eligibilityPercentage -= 5;

      warnings.push(
        "Unsecured personal borrowing may result in more conservative lender eligibility.",
      );
      break;

    case "other":
    default:
      eligibilityPercentage -= 5;

      warnings.push(
        "General-purpose borrowing is assessed using conservative eligibility assumptions.",
      );
      break;
  }

  /*
   * ==================================
   * CREDIT SCORE
   * ==================================
   */

  if (
    profile.creditScoreStatus === "unknown" ||
    profile.creditScore === undefined
  ) {
    eligibilityPercentage -= 10;

    warnings.push(
      "Credit score is unknown, so lender eligibility is estimated more conservatively.",
    );
  } else if (profile.creditScore < 550) {
    eligibilityPercentage -= 35;

    warnings.push(
      "The reported credit score may significantly reduce lender eligibility.",
    );
  } else if (profile.creditScore < 650) {
    eligibilityPercentage -= 20;

    warnings.push(
      "The reported credit score may reduce the amount or terms available.",
    );
  } else if (profile.creditScore < 750) {
    eligibilityPercentage -= 5;

    reasons.push(
      "The reported credit score supports moderate lender eligibility.",
    );
  } else {
    reasons.push(
      "Strong reported credit history supports lender eligibility.",
    );
  }

  /*
   * ==================================
   * RECENT MISSED PAYMENT
   * ==================================
   */

  if (profile.recentMissedPayment) {
    eligibilityPercentage -= 20;

    warnings.push(
      "A recent missed payment may reduce the amount a lender is willing to sanction.",
    );
  }

  /*
   * ==================================
   * INCOME HISTORY
   * ==================================
   */

  if (profile.incomeType === "salaried") {
    if (
      profile.employmentYears !== undefined &&
      profile.employmentYears >= 3
    ) {
      reasons.push(
        "Stable employment history supports lender eligibility.",
      );
    } else if (
      profile.employmentYears !== undefined &&
      profile.employmentYears < 1
    ) {
      eligibilityPercentage -= 10;

      warnings.push(
        "Limited employment history may reduce lender confidence.",
      );
    }
  }

  if (profile.incomeType === "self_employed") {
    if (
      profile.businessYears !== undefined &&
      profile.businessYears >= 3
    ) {
      reasons.push(
        "Established business history supports lender eligibility.",
      );
    } else if (
      profile.businessYears !== undefined &&
      profile.businessYears < 1
    ) {
      eligibilityPercentage -= 15;

      warnings.push(
        "Limited business operating history may reduce lender eligibility.",
      );
    }
  }

  /*
   * ==================================
   * INCOME TYPE
   * ==================================
   */

  if (profile.incomeType === "informal") {
    eligibilityPercentage -= 15;

    warnings.push(
      "Informal income can make lender verification more difficult.",
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
    reasons.push(
      "Available collateral may support eligibility for secured borrowing.",
    );

    if (
      profile.collateralValue >=
      affordableLoanAmount * 0.5
    ) {
      eligibilityPercentage += 10;
    }
  }

  /*
   * ==================================
   * CO-APPLICANT
   * ==================================
   */

  if (profile.hasCoApplicant) {
    eligibilityPercentage += 5;

    reasons.push(
      "A co-applicant may strengthen lender eligibility.",
    );
  }

  /*
   * ==================================
   * SAFETY BOUNDS
   * ==================================
   */

  eligibilityPercentage = Math.max(
    20,
    Math.min(eligibilityPercentage, 110),
  );

  const likelySanctionAmount =
    affordableLoanAmount *
    (eligibilityPercentage / 100);

  return {
    likelySanctionAmount: Math.round(
      likelySanctionAmount,
    ),

    eligibilityPercentage,

    reasons,

    warnings,
  };
}