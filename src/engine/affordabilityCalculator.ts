import type { BorrowerProfile } from "../types/borrower";

import {
  EMERGENCY_SAVINGS_RULES,
  SAFE_EMI_FACTORS,
} from "../config/financialRules";

import type {
  IncomeReliability,
} from "./incomeCalculator";


export interface AffordabilityInput {
  usableMonthlyIncome: number;

  monthlyExpenses: number;

  existingEmi: number;

  incomeReliability: IncomeReliability;

  emergencySavingsMonths?: number;

  upcomingLargeExpense?: boolean;
}


export interface AffordabilityResult {
  usableMonthlyIncome: number;

  monthlyExpenses: number;

  existingEmi: number;

  disposableIncome: number;

  baseSafeMonthlyEmi: number;

  safeMonthlyEmi: number;

  safetyFactor: number;

  safetyAdjustmentPercentage: number;

  explanation: string;
}


/**
 * Calculates the maximum safe new EMI.
 *
 * Core rule:
 *
 * Disposable Income
 * =
 * Usable Income
 * - Household Expenses
 * - Existing EMI
 *
 * Safe EMI
 * =
 * Disposable Income × Safety Factor
 *
 * Emergency savings below one month apply
 * a 10% relative reduction.
 */
export function calculateSafeMonthlyEmi({
  usableMonthlyIncome,
  monthlyExpenses,
  existingEmi,
  incomeReliability,
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

  if (emergencySavingsMonths < 0) {
    throw new Error(
      "Emergency savings months cannot be negative.",
    );
  }


  /* =====================================================
     1. DISPOSABLE INCOME
     ===================================================== */

  const disposableIncome =
    Math.max(
      usableMonthlyIncome -
        monthlyExpenses -
        existingEmi,
      0,
    );


  /* =====================================================
     2. BASE SAFETY FACTOR
     ===================================================== */

  const safetyFactor =
    SAFE_EMI_FACTORS[
      incomeReliability
    ];


  /* =====================================================
     3. BASE SAFE EMI
     ===================================================== */

  const baseSafeMonthlyEmi =
    disposableIncome *
    safetyFactor;


  /* =====================================================
     4. EMERGENCY SAVINGS ADJUSTMENT
     ===================================================== */

  let safetyAdjustmentPercentage = 0;

  let adjustedSafeMonthlyEmi =
    baseSafeMonthlyEmi;

  if (
    emergencySavingsMonths <
    EMERGENCY_SAVINGS_RULES.criticalThresholdMonths
  ) {
    safetyAdjustmentPercentage =
      EMERGENCY_SAVINGS_RULES
        .criticalAdjustment *
      100;

    adjustedSafeMonthlyEmi =
      baseSafeMonthlyEmi *
      (
        1 -
        EMERGENCY_SAVINGS_RULES
          .criticalAdjustment
      );
  }


  /*
   * Upcoming large expenses are currently retained
   * as profile information but do not create an
   * undocumented percentage adjustment.
   *
   * This keeps the calculation aligned with RULE.md.
   */
  const safeMonthlyEmi =
    Math.max(
      adjustedSafeMonthlyEmi,
      0,
    );


  /* =====================================================
     5. EXPLANATION
     ===================================================== */

  let explanation: string;

  if (disposableIncome <= 0) {
    explanation =
      "Your usable income is fully consumed by household expenses and existing EMI obligations, leaving no safe capacity for a new EMI.";
  } else if (
    emergencySavingsMonths <
    EMERGENCY_SAVINGS_RULES
      .criticalThresholdMonths
  ) {
    explanation =
      "The safe EMI is based on disposable income and your income reliability factor, with an additional 10% reduction because your emergency savings cover less than one month.";
  } else if (upcomingLargeExpense) {
    explanation =
      "The safe EMI is based on disposable income and your income reliability factor. A reported upcoming large expense is shown as a risk signal but does not apply an undocumented extra percentage adjustment.";
  } else {
    explanation =
      "The safe EMI is based on disposable income and the income reliability factor, while keeping part of disposable income uncommitted for financial safety.";
  }


  return {
    usableMonthlyIncome:
      Math.round(
        usableMonthlyIncome,
      ),

    monthlyExpenses:
      Math.round(
        monthlyExpenses,
      ),

    existingEmi:
      Math.round(
        existingEmi,
      ),

    disposableIncome:
      Math.round(
        disposableIncome,
      ),

    baseSafeMonthlyEmi:
      Math.round(
        baseSafeMonthlyEmi,
      ),

    safeMonthlyEmi:
      Math.round(
        safeMonthlyEmi,
      ),

    safetyFactor,

    safetyAdjustmentPercentage,

    explanation,
  };
}


/**
 * Convenience function for calculating affordability
 * directly from a borrower profile.
 */
export function calculateProfileAffordability(
  profile: BorrowerProfile,
  usableMonthlyIncome: number,
  incomeReliability: IncomeReliability,
): AffordabilityResult {
  return calculateSafeMonthlyEmi({
    usableMonthlyIncome,

    monthlyExpenses:
      profile.monthlyExpenses ?? 0,

    existingEmi:
      profile.existingEmi ?? 0,

    incomeReliability,

    emergencySavingsMonths:
      profile.emergencySavingsMonths ?? 0,

    upcomingLargeExpense:
      profile.upcomingLargeExpense ?? false,
  });
}