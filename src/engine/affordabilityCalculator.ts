import type { BorrowerProfile } from "../types/borrower";

export interface AffordabilityInput {
  usableMonthlyIncome: number;
  monthlyExpenses: number;
  existingEmi: number;
  emergencySavingsMonths?: number;
  upcomingLargeExpense?: boolean;
}

export interface AffordabilityResult {
  usableMonthlyIncome: number;

  monthlyExpenses: number;

  existingEmi: number;

  disposableIncome: number;

  maxEmiByIncomeRatio: number;

  maxEmiByDisposableIncome: number;

  safeMonthlyEmi: number;

  safetyAdjustmentPercentage: number;

  explanation: string;
}

/**
 * Calculates the maximum safe EMI a borrower
 * can take after considering:
 *
 * - Income
 * - Household expenses
 * - Existing EMI
 * - Emergency savings
 * - Upcoming major expenses
 */
export function calculateSafeMonthlyEmi({
  usableMonthlyIncome,
  monthlyExpenses,
  existingEmi,
  emergencySavingsMonths = 0,
  upcomingLargeExpense = false,
}: AffordabilityInput): AffordabilityResult {
  if (usableMonthlyIncome <= 0) {
    throw new Error(
      "Usable monthly income must be greater than zero.",
    );
  }

  if (monthlyExpenses < 0) {
    throw new Error(
      "Monthly expenses cannot be negative.",
    );
  }

  if (existingEmi < 0) {
    throw new Error(
      "Existing EMI cannot be negative.",
    );
  }

  /*
   * Remaining income after necessary expenses
   * and current loan obligations.
   */
  const disposableIncome =
    usableMonthlyIncome -
    monthlyExpenses -
    existingEmi;

  /*
   * Base EMI ratio.
   *
   * We start with 40% of usable income as an
   * upper affordability boundary.
   *
   * This includes the borrower's existing EMI.
   */
  let safeEmiPercentage = 40;

  /*
   * Lower savings means higher financial risk.
   */
  if (emergencySavingsMonths < 3) {
    safeEmiPercentage -= 10;
  } else if (emergencySavingsMonths < 6) {
    safeEmiPercentage -= 5;
  }

  /*
   * Reduce affordability if a major known
   * expense is expected soon.
   */
  if (upcomingLargeExpense) {
    safeEmiPercentage -= 5;
  }

  /*
   * Prevent the ratio from becoming too aggressive
   * or unrealistically low.
   */
  safeEmiPercentage = Math.max(
    safeEmiPercentage,
    20,
  );

  /*
   * Maximum TOTAL EMI capacity.
   */
  const totalEmiCapacity =
    usableMonthlyIncome *
    (safeEmiPercentage / 100);

  /*
   * Existing EMIs consume part of the capacity.
   */
  const maxEmiByIncomeRatio =
    Math.max(
      totalEmiCapacity - existingEmi,
      0,
    );

  /*
   * Never allocate all disposable income
   * to the new EMI.
   *
   * We allow only 60% of disposable income.
   */
  const maxEmiByDisposableIncome =
    Math.max(
      disposableIncome * 0.6,
      0,
    );

  /*
   * The conservative safe EMI ceiling
   * is the lower of both limits.
   */
  const safeMonthlyEmi = Math.max(
    Math.min(
      maxEmiByIncomeRatio,
      maxEmiByDisposableIncome,
    ),
    0,
  );

  return {
    usableMonthlyIncome:
      Math.round(usableMonthlyIncome),

    monthlyExpenses:
      Math.round(monthlyExpenses),

    existingEmi:
      Math.round(existingEmi),

    disposableIncome:
      Math.round(disposableIncome),

    maxEmiByIncomeRatio:
      Math.round(maxEmiByIncomeRatio),

    maxEmiByDisposableIncome:
      Math.round(maxEmiByDisposableIncome),

    safeMonthlyEmi:
      Math.round(safeMonthlyEmi),

    safetyAdjustmentPercentage:
      safeEmiPercentage,

    explanation:
      safeMonthlyEmi > 0
        ? "The safe EMI ceiling is based on both income capacity and remaining disposable income, using the more conservative limit."
        : "Your current expenses and existing EMI obligations leave no safe capacity for an additional EMI.",
  };
}

/**
 * Convenience function for calculating affordability
 * directly from a borrower profile.
 */
export function calculateProfileAffordability(
  profile: BorrowerProfile,
  usableMonthlyIncome: number,
): AffordabilityResult {
  return calculateSafeMonthlyEmi({
    usableMonthlyIncome,

    monthlyExpenses:
      profile.monthlyExpenses ?? 0,

    existingEmi:
      profile.existingEmi ?? 0,

    emergencySavingsMonths:
      profile.emergencySavingsMonths ?? 0,

    upcomingLargeExpense:
      profile.upcomingLargeExpense ?? false,
  });
}