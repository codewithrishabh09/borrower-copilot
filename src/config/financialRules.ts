/**
 * Borrower Copilot
 * Central Financial Rules
 *
 * This file is the single source of truth for
 * the core financial assumptions used by the
 * borrowing assessment engine.
 *
 * Keep these values synchronized with RULE.md.
 */

/* =========================================================
   INCOME RELIABILITY
   ========================================================= */

/**
 * Percentage of normalized income that is considered
 * usable based on income reliability.
 */
export const INCOME_RELIABILITY_FACTORS = {
  high: 0.90,
  medium: 0.75,
  low: 0.60,
} as const;


/* =========================================================
   SAFE EMI
   ========================================================= */

/**
 * Percentage of disposable income that can be used
 * for a new EMI.
 *
 * The remaining disposable income acts as a safety
 * buffer for unexpected expenses and income changes.
 */
export const SAFE_EMI_FACTORS = {
  high: 0.50,
  medium: 0.40,
  low: 0.30,
} as const;


/* =========================================================
   EMERGENCY SAVINGS
   ========================================================= */

/**
 * Emergency savings thresholds are measured in
 * months of household expenses.
 */
export const EMERGENCY_SAVINGS_RULES = {
  criticalThresholdMonths: 1,

  /*
   * A borrower with less than one month of emergency
   * savings receives a 10% relative reduction in
   * the calculated Safe EMI.
   */
  criticalAdjustment: 0.10,

  /*
   * Having 1–3 months of savings does not increase
   * borrowing capacity.
   */
  noAdjustmentUpperBoundMonths: 3,
} as const;


/* =========================================================
   INCOME RELIABILITY CLASSIFICATION
   ========================================================= */

/**
 * Employment/business history threshold used when
 * determining whether income can be considered stable.
 *
 * 24 months = 2 years.
 */
export const INCOME_STABILITY_RULES = {
  establishedHistoryMonths: 24,
} as const;


/* =========================================================
   VARIABLE / INFORMAL INCOME
   ========================================================= */

/**
 * When a borrower provides a lower and upper income
 * range, the model uses the midpoint as the income base.
 *
 * Example:
 *
 * Lower = ₹30,000
 * Upper = ₹50,000
 *
 * Base =
 * ₹30,000 + 50% × (₹50,000 - ₹30,000)
 * = ₹40,000
 */
export const VARIABLE_INCOME_RULES = {
  lowerIncomeWeight: 0.50,
  upperIncomeWeight: 0.50,
} as const;


/* =========================================================
   STRESS TESTING
   ========================================================= */

/**
 * Income reduction scenarios used during stress testing.
 */
export const STRESS_TEST_SCENARIOS = {
  mild: {
    label: "Mild",
    incomeReduction: 0.10,
  },

  moderate: {
    label: "Moderate",
    incomeReduction: 0.20,
  },

  severe: {
    label: "Severe",
    incomeReduction: 0.30,
  },
} as const;


/* =========================================================
   FINANCIAL SAFETY LIMITS
   ========================================================= */

/**
 * Minimum Safe EMI factor.
 *
 * This prevents accidental configuration values
 * from creating an invalid negative/zero safety rule.
 */
export const FINANCIAL_SAFETY_LIMITS = {
  minimumSafeEmiFactor: 0,
  maximumSafeEmiFactor: 1,
} as const;


/* =========================================================
   RULES VERSION
   ========================================================= */

/**
 * Increment this whenever the core financial rules
 * materially change.
 */
export const FINANCIAL_RULES_VERSION = "1.0.0";