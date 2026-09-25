import type {
  BorrowerProfile,
  IncomeType,
} from "../types/borrower";

import {
  INCOME_RELIABILITY_FACTORS,
  INCOME_STABILITY_RULES,
  VARIABLE_INCOME_RULES,
} from "../config/financialRules";

export type IncomeReliability =
  | "high"
  | "medium"
  | "low";

export interface IncomeCalculationResult {
  incomeType: IncomeType | "unknown";

  /**
   * Income used by the lending engine after
   * income normalization and reliability adjustment.
   */
  usableMonthlyIncome: number;

  /**
   * Original monthly income reported by borrower.
   */
  reportedMonthlyIncome: number;

  /**
   * Income amount before applying the reliability factor.
   */
  normalizedMonthlyIncome: number;

  /**
   * Reliability factor applied to normalized income.
   */
  reliabilityFactor: number;

  /**
   * Indicates how the usable income was calculated.
   */
  calculationMethod: string;

  /**
   * Reliability level of the income estimate.
   */
  incomeReliability: IncomeReliability;
}


/**
 * Converts annual income into monthly income.
 */
function annualToMonthlyIncome(
  annualIncome: number,
): number {
  if (annualIncome <= 0) {
    return 0;
  }

  return annualIncome / 12;
}


/**
 * Applies the centralized income reliability factor.
 */
function applyReliabilityFactor(
  normalizedIncome: number,
  reliability: IncomeReliability,
): number {
  const factor =
    INCOME_RELIABILITY_FACTORS[reliability];

  return normalizedIncome * factor;
}


/**
 * Calculates normalized income for different
 * borrower income types.
 */
export function calculateUsableIncome(
  profile: BorrowerProfile,
): IncomeCalculationResult {
  const incomeType = profile.incomeType;

  const reportedMonthlyIncome =
    Math.max(
      profile.monthlyIncome ?? 0,
      0,
    );


  /* =====================================================
     SALARIED BORROWER
     ===================================================== */

  if (incomeType === "salaried") {
    const employmentMonths =
      (profile.employmentYears ?? 0) * 12;

    const isEstablished =
      employmentMonths >=
      INCOME_STABILITY_RULES.establishedHistoryMonths;

    const incomeReliability: IncomeReliability =
      isEstablished
        ? "high"
        : "medium";

    const normalizedMonthlyIncome =
      reportedMonthlyIncome;

    const usableMonthlyIncome =
      applyReliabilityFactor(
        normalizedMonthlyIncome,
        incomeReliability,
      );

    return {
      incomeType,

      usableMonthlyIncome:
        Math.round(usableMonthlyIncome),

      reportedMonthlyIncome,

      normalizedMonthlyIncome:
        Math.round(normalizedMonthlyIncome),

      reliabilityFactor:
        INCOME_RELIABILITY_FACTORS[
          incomeReliability
        ],

      calculationMethod:
        isEstablished
          ? "Reported monthly income is normalized using the HIGH reliability factor because employment history is at least 24 months."
          : "Reported monthly income is normalized using the MEDIUM reliability factor because employment history is below 24 months.",

      incomeReliability,
    };
  }


  /* =====================================================
     SELF-EMPLOYED BORROWER
     ===================================================== */

  if (incomeType === "self_employed") {
    const businessMonths =
      (profile.businessYears ?? 0) * 12;

    const itrMonthlyIncome =
      annualToMonthlyIncome(
        profile.annualItrIncome ?? 0,
      );

    /*
     * If ITR income is available, use the lower
     * of reported and documented income.
     */
    const normalizedMonthlyIncome =
      itrMonthlyIncome > 0
        ? Math.min(
            reportedMonthlyIncome,
            itrMonthlyIncome,
          )
        : reportedMonthlyIncome;

    const hasEstablishedBusiness =
      businessMonths >=
      INCOME_STABILITY_RULES.establishedHistoryMonths;

    const hasDocumentedIncome =
      itrMonthlyIncome > 0;

    const incomeReliability: IncomeReliability =
      hasEstablishedBusiness &&
      hasDocumentedIncome
        ? "medium"
        : "low";

    const usableMonthlyIncome =
      applyReliabilityFactor(
        normalizedMonthlyIncome,
        incomeReliability,
      );

    return {
      incomeType,

      usableMonthlyIncome:
        Math.round(usableMonthlyIncome),

      reportedMonthlyIncome,

      normalizedMonthlyIncome:
        Math.round(normalizedMonthlyIncome),

      reliabilityFactor:
        INCOME_RELIABILITY_FACTORS[
          incomeReliability
        ],

      calculationMethod:
        hasDocumentedIncome
          ? "The lower of reported monthly income and ITR-based monthly income is used before applying the income reliability factor."
          : "Reported monthly income is used because ITR-based income was unavailable.",

      incomeReliability,
    };
  }


  /* =====================================================
     INFORMAL / VARIABLE INCOME
     ===================================================== */

  if (incomeType === "informal") {
    const minimumIncome =
      Math.max(
        profile.minimumMonthlyIncome ??
          reportedMonthlyIncome,
        0,
      );

    const maximumIncome =
      Math.max(
        profile.maximumMonthlyIncome ??
          reportedMonthlyIncome,
        0,
      );

    /*
     * RULE.md:
     *
     * Lower Income Bound
     * +
     * 50% × (Upper Income Bound - Lower Income Bound)
     *
     * This is equivalent to a 50/50 midpoint.
     */

    const lowerWeight =
      VARIABLE_INCOME_RULES.lowerIncomeWeight;

    const upperWeight =
      VARIABLE_INCOME_RULES.upperIncomeWeight;

    const normalizedMonthlyIncome =
      minimumIncome * lowerWeight +
      maximumIncome * upperWeight;

    const incomeReliability: IncomeReliability =
      "low";

    const usableMonthlyIncome =
      applyReliabilityFactor(
        normalizedMonthlyIncome,
        incomeReliability,
      );

    return {
      incomeType,

      usableMonthlyIncome:
        Math.round(usableMonthlyIncome),

      reportedMonthlyIncome,

      normalizedMonthlyIncome:
        Math.round(normalizedMonthlyIncome),

      reliabilityFactor:
        INCOME_RELIABILITY_FACTORS[
          incomeReliability
        ],

      calculationMethod:
        "The midpoint of the lower and upper typical income is used as the normalized income, followed by the LOW reliability factor.",

      incomeReliability,
    };
  }


  /* =====================================================
     UNKNOWN INCOME TYPE
     ===================================================== */

  return {
    incomeType: "unknown",

    usableMonthlyIncome: 0,

    reportedMonthlyIncome,

    normalizedMonthlyIncome: 0,

    reliabilityFactor:
      INCOME_RELIABILITY_FACTORS.low,

    calculationMethod:
      "Income type was not available.",

    incomeReliability: "low",
  };
}