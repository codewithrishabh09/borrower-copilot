export interface EmiCalculationInput {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
}

export interface EmiCalculationResult {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
}

/**
 * Calculates EMI using the standard reducing-balance formula.
 *
 * EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 *
 * P = Principal
 * r = Monthly interest rate
 * n = Total number of monthly payments
 */
export function calculateEmi({
  principal,
  annualInterestRate,
  tenureMonths,
}: EmiCalculationInput): EmiCalculationResult {
  if (principal <= 0) {
    throw new Error("Principal must be greater than zero.");
  }

  if (annualInterestRate < 0) {
    throw new Error(
      "Interest rate cannot be negative.",
    );
  }

  if (tenureMonths <= 0) {
    throw new Error(
      "Tenure must be greater than zero.",
    );
  }

  const monthlyRate =
    annualInterestRate / 12 / 100;

  /**
   * Zero-interest loan.
   */
  if (monthlyRate === 0) {
    const monthlyEmi =
      principal / tenureMonths;

    return {
      monthlyEmi: Math.round(monthlyEmi),
      totalPayment: Math.round(principal),
      totalInterest: 0,
    };
  }

  const compoundFactor =
    Math.pow(
      1 + monthlyRate,
      tenureMonths,
    );

  const monthlyEmi =
    (principal *
      monthlyRate *
      compoundFactor) /
    (compoundFactor - 1);

  const totalPayment =
    monthlyEmi * tenureMonths;

  const totalInterest =
    totalPayment - principal;

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

/**
 * Calculates the maximum principal
 * that can be supported by a given EMI.
 *
 * This is the inverse EMI formula.
 */
export function calculateAffordableLoanAmount(
  safeMonthlyEmi: number,
  annualInterestRate: number,
  tenureMonths: number,
): number {
  if (safeMonthlyEmi <= 0) {
    return 0;
  }

  if (annualInterestRate < 0) {
    throw new Error(
      "Interest rate cannot be negative.",
    );
  }

  if (tenureMonths <= 0) {
    throw new Error(
      "Tenure must be greater than zero.",
    );
  }

  const monthlyRate =
    annualInterestRate / 12 / 100;

  /**
   * Zero-interest case.
   */
  if (monthlyRate === 0) {
    return Math.round(
      safeMonthlyEmi * tenureMonths,
    );
  }

  const compoundFactor =
    Math.pow(
      1 + monthlyRate,
      tenureMonths,
    );

  const principal =
    (safeMonthlyEmi *
      (compoundFactor - 1)) /
    (monthlyRate * compoundFactor);

  return Math.round(principal);
}

/**
 * Calculates what percentage of income
 * is consumed by EMI.
 */
export function calculateEmiToIncomeRatio(
  monthlyEmi: number,
  monthlyIncome: number,
): number {
  if (monthlyIncome <= 0) {
    return 0;
  }

  return Number(
    (
      (monthlyEmi / monthlyIncome) *
      100
    ).toFixed(2),
  );
}