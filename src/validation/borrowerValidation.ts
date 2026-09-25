import type { BorrowerProfile } from "../types/borrower";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

function addError(
  errors: ValidationError[],
  field: string,
  message: string,
): void {
  errors.push({
    field,
    message,
  });
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function validateNonNegative(
  errors: ValidationError[],
  field: string,
  value: number | undefined,
  label: string,
  required = false,
): void {
  if (value === undefined) {
    if (required) {
      addError(
        errors,
        field,
        `${label} is required.`,
      );
    }

    return;
  }

  if (!isFiniteNumber(value)) {
    addError(
      errors,
      field,
      `${label} must be a valid number.`,
    );

    return;
  }

  if (value < 0) {
    addError(
      errors,
      field,
      `${label} cannot be negative.`,
    );
  }
}

/**
 * Validates borrower input before it reaches
 * the financial calculation engine.
 */
export function validateBorrowerProfile(
  profile: BorrowerProfile,
): ValidationResult {
  const errors: ValidationError[] = [];

  /* ==============================
     BASIC REQUIRED FIELDS
  ============================== */

  if (!profile.loanPurpose) {
    addError(
      errors,
      "loanPurpose",
      "Loan purpose is required.",
    );
  }

  if (
    !isFiniteNumber(
      profile.requestedAmount,
    ) ||
    profile.requestedAmount <= 0
  ) {
    addError(
      errors,
      "requestedAmount",
      "Requested loan amount must be greater than ₹0.",
    );
  }

  if (!profile.incomeType) {
    addError(
      errors,
      "incomeType",
      "Income type is required.",
    );
  }

  /* ==============================
     INCOME
  ============================== */

  if (
    !isFiniteNumber(
      profile.monthlyIncome,
    ) ||
    profile.monthlyIncome <= 0
  ) {
    addError(
      errors,
      "monthlyIncome",
      "Monthly income must be greater than ₹0.",
    );
  }

  /* ==============================
     EXISTING EMI
  ============================== */

  validateNonNegative(
    errors,
    "existingEmi",
    profile.existingEmi,
    "Existing EMI",
    true,
  );

  /* ==============================
     MONTHLY EXPENSES
  ============================== */

  validateNonNegative(
    errors,
    "monthlyExpenses",
    profile.monthlyExpenses,
    "Monthly expenses",
    true,
  );

  /* ==============================
     INCOME vs EXPENSES
  ============================== */

  if (
    isFiniteNumber(
      profile.monthlyIncome,
    ) &&
    isFiniteNumber(
      profile.monthlyExpenses,
    ) &&
    profile.monthlyExpenses >
      profile.monthlyIncome
  ) {
    addError(
      errors,
      "monthlyExpenses",
      "Monthly expenses are greater than monthly income. Please verify the values.",
    );
  }

  /* ==============================
     AGE
  ============================== */

  if (!isFiniteNumber(profile.age)) {
    addError(
      errors,
      "age",
      "Age is required.",
    );
  } else if (
    profile.age < 18 ||
    profile.age > 75
  ) {
    addError(
      errors,
      "age",
      "Age must be between 18 and 75 years.",
    );
  }

  /* ==============================
     CREDIT SCORE
  ============================== */

  if (
    profile.creditScoreStatus ===
    "known"
  ) {
    if (
      !isFiniteNumber(
        profile.creditScore,
      )
    ) {
      addError(
        errors,
        "creditScore",
        "Credit score is required when you select that you know it.",
      );
    } else if (
      profile.creditScore < 300 ||
      profile.creditScore > 900
    ) {
      addError(
        errors,
        "creditScore",
        "Credit score must be between 300 and 900.",
      );
    }
  }

  /* ==============================
     SALARIED
  ============================== */

  if (
    profile.incomeType ===
    "salaried"
  ) {
    validateNonNegative(
      errors,
      "employmentYears",
      profile.employmentYears,
      "Employment history",
      true,
    );
  }

  /* ==============================
     SELF EMPLOYED
  ============================== */

  if (
    profile.incomeType ===
    "self_employed"
  ) {
    validateNonNegative(
      errors,
      "businessYears",
      profile.businessYears,
      "Business history",
      true,
    );

    validateNonNegative(
      errors,
      "annualItrIncome",
      profile.annualItrIncome,
      "Annual ITR income",
    );
  }

  /* ==============================
     INFORMAL INCOME
  ============================== */

  if (
    profile.incomeType ===
    "informal"
  ) {
    validateNonNegative(
      errors,
      "minimumMonthlyIncome",
      profile.minimumMonthlyIncome,
      "Minimum monthly income",
      true,
    );

    validateNonNegative(
      errors,
      "maximumMonthlyIncome",
      profile.maximumMonthlyIncome,
      "Maximum monthly income",
      true,
    );

    if (
      isFiniteNumber(
        profile.minimumMonthlyIncome,
      ) &&
      isFiniteNumber(
        profile.maximumMonthlyIncome,
      ) &&
      profile.maximumMonthlyIncome <
        profile.minimumMonthlyIncome
    ) {
      addError(
        errors,
        "maximumMonthlyIncome",
        "Maximum monthly income cannot be lower than minimum monthly income.",
      );
    }
  }

  /* ==============================
     EMERGENCY SAVINGS
  ============================== */

  validateNonNegative(
    errors,
    "emergencySavingsMonths",
    profile.emergencySavingsMonths,
    "Emergency savings",
    true,
  );

  /* ==============================
     GOLD LOAN
  ============================== */

  if (
    profile.loanPurpose ===
    "gold"
  ) {
    if (
      !isFiniteNumber(
        profile.goldEstimatedValue,
      ) ||
      profile.goldEstimatedValue <= 0
    ) {
      addError(
        errors,
        "goldEstimatedValue",
        "Estimated gold value must be greater than ₹0 for a Gold Loan assessment.",
      );
    }
  }

  return {
    isValid:
      errors.length === 0,

    errors,
  };
}