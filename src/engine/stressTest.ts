export interface StressTestInput {
  monthlyIncome: number;
  monthlyEmi: number;

  /**
   * Maximum percentage of monthly income
   * that should be used for EMI.
   *
   * Example:
   * 40 means EMI should not exceed
   * 40% of stressed income.
   */
  safeEmiPercentage?: number;

  /**
   * Income drop scenarios.
   *
   * Example:
   * [10, 20, 30]
   */
  incomeDropPercentages?: number[];
}

export interface StressScenario {
  incomeDropPercentage: number;
  stressedIncome: number;
  emiToIncomeRatio: number;
  safeEmiLimit: number;
  remainingIncome: number;
  isAffordable: boolean;
}

export interface StressTestResult {
  currentIncome: number;
  monthlyEmi: number;
  safeEmiPercentage: number;
  scenarios: StressScenario[];
  worstCaseAffordable: boolean;
}

/**
 * Tests whether the borrower can continue
 * paying the EMI after different income drops.
 */
export function runStressTest({
  monthlyIncome,
  monthlyEmi,
  safeEmiPercentage = 40,
  incomeDropPercentages = [10, 20, 30],
}: StressTestInput): StressTestResult {
  if (monthlyIncome <= 0) {
    throw new Error(
      "Monthly income must be greater than zero.",
    );
  }

  if (monthlyEmi < 0) {
    throw new Error(
      "Monthly EMI cannot be negative.",
    );
  }

  if (
    safeEmiPercentage <= 0 ||
    safeEmiPercentage > 100
  ) {
    throw new Error(
      "Safe EMI percentage must be between 1 and 100.",
    );
  }

  const scenarios = incomeDropPercentages.map(
    (incomeDropPercentage) => {
      if (
        incomeDropPercentage < 0 ||
        incomeDropPercentage >= 100
      ) {
        throw new Error(
          "Income drop percentage must be between 0 and 99.",
        );
      }

      const stressedIncome =
        monthlyIncome *
        (1 - incomeDropPercentage / 100);

      const safeEmiLimit =
        stressedIncome *
        (safeEmiPercentage / 100);

      const remainingIncome =
        stressedIncome - monthlyEmi;

      const emiToIncomeRatio =
        stressedIncome > 0
          ? (monthlyEmi / stressedIncome) * 100
          : 100;

      return {
        incomeDropPercentage,
        stressedIncome: Math.round(stressedIncome),
        emiToIncomeRatio: Number(
          emiToIncomeRatio.toFixed(2),
        ),
        safeEmiLimit: Math.round(safeEmiLimit),
        remainingIncome: Math.round(
          remainingIncome,
        ),
        isAffordable:
          monthlyEmi <= safeEmiLimit,
      };
    },
  );

  return {
    currentIncome: monthlyIncome,
    monthlyEmi,
    safeEmiPercentage,
    scenarios,
    worstCaseAffordable: scenarios.every(
      (scenario) => scenario.isAffordable,
    ),
  };
}

/**
 * Returns the highest income drop percentage
 * that the borrower can safely handle.
 */
export function getMaximumSafeIncomeDrop(
  stressTestResult: StressTestResult,
): number {
  const affordableScenarios =
    stressTestResult.scenarios.filter(
      (scenario) => scenario.isAffordable,
    );

  if (affordableScenarios.length === 0) {
    return 0;
  }

  return Math.max(
    ...affordableScenarios.map(
      (scenario) =>
        scenario.incomeDropPercentage,
    ),
  );
}