export interface AprCalculationInput {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  processingFeePercentage: number;
}

export interface AprCalculationResult {
  processingFee: number;
  netDisbursedAmount: number;
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  estimatedApr: number;
}

/**
 * Calculates the monthly EMI using the
 * standard reducing-balance loan formula.
 */
function calculateMonthlyEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
): number {
  const monthlyRate =
    annualInterestRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  const compoundFactor = Math.pow(
    1 + monthlyRate,
    tenureMonths,
  );

  return (
    (principal *
      monthlyRate *
      compoundFactor) /
    (compoundFactor - 1)
  );
}

/**
 * Calculates the present value of all future
 * EMI payments at a given monthly rate.
 */
function calculatePresentValue(
  monthlyEmi: number,
  monthlyRate: number,
  tenureMonths: number,
): number {
  if (monthlyRate === 0) {
    return monthlyEmi * tenureMonths;
  }

  const discountFactor =
    1 -
    Math.pow(
      1 + monthlyRate,
      -tenureMonths,
    );

  return (
    monthlyEmi *
    (discountFactor / monthlyRate)
  );
}

/**
 * Estimates the effective APR using binary search.
 *
 * We solve for the interest rate where:
 *
 * Present Value of future EMI payments
 * =
 * Actual amount received by borrower
 *
 * This accounts for upfront processing fees.
 */
function estimateApr(
  netDisbursedAmount: number,
  monthlyEmi: number,
  tenureMonths: number,
): number {
  if (
    netDisbursedAmount <= 0 ||
    monthlyEmi <= 0 ||
    tenureMonths <= 0
  ) {
    return 0;
  }

  let low = 0;
  let high = 1;

  for (let iteration = 0; iteration < 100; iteration++) {
    const mid = (low + high) / 2;

    const presentValue =
      calculatePresentValue(
        monthlyEmi,
        mid,
        tenureMonths,
      );

    if (presentValue > netDisbursedAmount) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const monthlyRate =
    (low + high) / 2;

  const annualApr =
    monthlyRate * 12 * 100;

  return Number(annualApr.toFixed(2));
}

/**
 * Calculates effective borrowing cost.
 *
 * Includes:
 * - Interest cost
 * - Processing fee
 * - Net amount actually received
 * - Estimated effective APR
 */
export function calculateEffectiveApr({
  principal,
  annualInterestRate,
  tenureMonths,
  processingFeePercentage,
}: AprCalculationInput): AprCalculationResult {
  if (principal <= 0) {
    throw new Error(
      "Principal must be greater than zero.",
    );
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

  if (processingFeePercentage < 0) {
    throw new Error(
      "Processing fee cannot be negative.",
    );
  }

  const processingFee =
    principal *
    (processingFeePercentage / 100);

  const netDisbursedAmount =
    principal - processingFee;

  const monthlyEmi =
    calculateMonthlyEmi(
      principal,
      annualInterestRate,
      tenureMonths,
    );

  const totalPayment =
    monthlyEmi * tenureMonths;

  const totalInterest =
    totalPayment - principal;

  const estimatedApr =
    estimateApr(
      netDisbursedAmount,
      monthlyEmi,
      tenureMonths,
    );

  return {
    processingFee: Math.round(processingFee),
    netDisbursedAmount:
      Math.round(netDisbursedAmount),
    monthlyEmi:
      Math.round(monthlyEmi),
    totalPayment:
      Math.round(totalPayment),
    totalInterest:
      Math.round(totalInterest),
    estimatedApr,
  };
}