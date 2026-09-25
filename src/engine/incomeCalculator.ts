import type {
  BorrowerProfile,
  IncomeType,
} from "../types/borrower";

export interface IncomeCalculationResult {
  incomeType: IncomeType | "unknown";

  /**
   * Income used by the lending engine.
   *
   * This can be more conservative than the
   * borrower-reported monthly income.
   */
  usableMonthlyIncome: number;

  /**
   * Original monthly income reported by borrower.
   */
  reportedMonthlyIncome: number;

  /**
   * Indicates how the usable income was calculated.
   */
  calculationMethod: string;

  /**
   * Reliability level of the income estimate.
   */
  incomeReliability: "high" | "medium" | "low";
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
 * Calculates normalized income for different
 * borrower income types.
 */
export function calculateUsableIncome(
  profile: BorrowerProfile,
): IncomeCalculationResult {
  const incomeType = profile.incomeType;

  const reportedMonthlyIncome =
    profile.monthlyIncome ?? 0;

  /*
   * ============================
   * SALARIED BORROWER
   * ============================
   */
  if (incomeType === "salaried") {
    return {
      incomeType,
      usableMonthlyIncome: Math.round(
        reportedMonthlyIncome,
      ),
      reportedMonthlyIncome,
      calculationMethod:
        "Using reported monthly net salary.",
      incomeReliability: "high",
    };
  }

  /*
   * ============================
   * SELF-EMPLOYED BORROWER
   * ============================
   *
   * Compare reported monthly income
   * with ITR-based monthly income.
   *
   * Use the lower value conservatively.
   */
  if (incomeType === "self_employed") {
    const itrMonthlyIncome =
      annualToMonthlyIncome(
        profile.annualItrIncome ?? 0,
      );

    const usableMonthlyIncome =
      itrMonthlyIncome > 0
        ? Math.min(
            reportedMonthlyIncome,
            itrMonthlyIncome,
          )
        : reportedMonthlyIncome;

    return {
      incomeType,
      usableMonthlyIncome: Math.round(
        usableMonthlyIncome,
      ),
      reportedMonthlyIncome,
      calculationMethod:
        itrMonthlyIncome > 0
          ? "Using the lower of reported income and ITR-based monthly income."
          : "Using reported monthly income because ITR income was unavailable.",
      incomeReliability:
        itrMonthlyIncome > 0
          ? "medium"
          : "low",
    };
  }

  /*
   * ============================
   * INFORMAL / VARIABLE INCOME
   * ============================
   *
   * Use the lowest typical monthly income
   * for a conservative affordability estimate.
   */
  if (incomeType === "informal") {
    const minimumIncome =
      profile.minimumMonthlyIncome ??
      reportedMonthlyIncome;

    const maximumIncome =
      profile.maximumMonthlyIncome ??
      reportedMonthlyIncome;

    /*
     * Conservative income calculation:
     * 70% of minimum + 30% of maximum.
     *
     * This avoids using the highest income
     * while still considering typical variation.
     */
    const usableMonthlyIncome =
      minimumIncome * 0.7 +
      maximumIncome * 0.3;

    return {
      incomeType,
      usableMonthlyIncome: Math.round(
        usableMonthlyIncome,
      ),
      reportedMonthlyIncome,
      calculationMethod:
        "Using a conservative weighted income estimate based on lower and higher typical income.",
      incomeReliability: "low",
    };
  }

  /*
   * ============================
   * UNKNOWN INCOME TYPE
   * ============================
   */
  return {
    incomeType: "unknown",
    usableMonthlyIncome: 0,
    reportedMonthlyIncome,
    calculationMethod:
      "Income type was not available.",
    incomeReliability: "low",
  };
}