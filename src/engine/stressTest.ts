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
  /* =========================================
     BASIC INPUT VALIDATION
     ========================================= */

  if (
    !Number.isFinite(monthlyIncome) ||
    monthlyIncome <= 0
  ) {
    throw new Error(
      "Monthly income must be greater than zero.",
    );
  }

  if (
    !Number.isFinite(monthlyEmi) ||
    monthlyEmi < 0
  ) {
    throw new Error(
      "Monthly EMI cannot be negative.",
    );
  }

  /* =========================================
     NORMALIZE SAFE EMI PERCENTAGE
     ========================================= */

  /*
   * safeEmiPercentage is an INTERNAL calculated
   * value. We normalize it here so that a bad
   * undefined/NaN/0 value cannot crash the entire
   * assessment.
   *
   * Default safe EMI ceiling = 40%.
   */

  const numericSafeEmiPercentage =
    Number(safeEmiPercentage);

  const normalizedSafeEmiPercentage =
    Number.isFinite(
      numericSafeEmiPercentage,
    ) &&
    numericSafeEmiPercentage > 0 &&
    numericSafeEmiPercentage <= 100
      ? numericSafeEmiPercentage
      : 40;

  /* =========================================
     VALIDATE INCOME DROP SCENARIOS
     ========================================= */

  if (
    !Array.isArray(
      incomeDropPercentages,
    ) ||
    incomeDropPercentages.length === 0
  ) {
    throw new Error(
      "At least one income stress scenario is required.",
    );
  }

  /* =========================================
     RUN STRESS SCENARIOS
     ========================================= */

  const scenarios =
    incomeDropPercentages.map(
      (incomeDropPercentage) => {
        const numericDrop =
          Number(
            incomeDropPercentage,
          );

        if (
          !Number.isFinite(
            numericDrop,
          ) ||
          numericDrop < 0 ||
          numericDrop >= 100
        ) {
          throw new Error(
            "Income drop percentage must be between 0 and 99.",
          );
        }

        const stressedIncome =
          monthlyIncome *
          (1 - numericDrop / 100);

        const safeEmiLimit =
          stressedIncome *
          (normalizedSafeEmiPercentage /
            100);

        const remainingIncome =
          stressedIncome -
          monthlyEmi;

        const emiToIncomeRatio =
          stressedIncome > 0
            ? (monthlyEmi /
                stressedIncome) *
              100
            : 100;

        /*
         * EMI is considered affordable when:
         *
         * 1. EMI does not exceed the safe EMI limit
         * 2. EMI does not exceed stressed income
         */

        const isAffordable =
          monthlyEmi <=
            safeEmiLimit &&
          monthlyEmi <=
            stressedIncome;

        return {
          incomeDropPercentage:
            numericDrop,

          stressedIncome:
            Math.round(
              stressedIncome,
            ),

          emiToIncomeRatio:
            Number(
              emiToIncomeRatio.toFixed(
                2,
              ),
            ),

          safeEmiLimit:
            Math.round(
              safeEmiLimit,
            ),

          remainingIncome:
            Math.round(
              remainingIncome,
            ),

          isAffordable,
        };
      },
    );

  /* =========================================
     WORST CASE
     ========================================= */

  const worstCaseAffordable =
    scenarios.every(
      (scenario) =>
        scenario.isAffordable,
    );

  return {
    currentIncome:
      Math.round(monthlyIncome),

    monthlyEmi:
      Math.round(monthlyEmi),

    safeEmiPercentage:
      normalizedSafeEmiPercentage,

    scenarios,

    worstCaseAffordable,
  };
}