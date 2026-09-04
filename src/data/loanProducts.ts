import type { LoanPurpose } from "../types/borrower";

export interface LoanProductConfig {
  purpose: LoanPurpose;

  label: string;

  annualInterestRate: number;

  tenureMonths: number;

  processingFeePercentage: number;

  description: string;
}

export const loanProducts: Record<
  LoanPurpose,
  LoanProductConfig
> = {
  personal: {
    purpose: "personal",
    label: "Personal Expense",
    annualInterestRate: 14,
    tenureMonths: 36,
    processingFeePercentage: 2,
    description:
      "Short to medium-term borrowing for personal expenses.",
  },

  business: {
    purpose: "business",
    label: "Business",
    annualInterestRate: 13,
    tenureMonths: 48,
    processingFeePercentage: 2,
    description:
      "Borrowing intended for working capital, inventory, expansion, or equipment.",
  },

  vehicle: {
    purpose: "vehicle",
    label: "Vehicle",
    annualInterestRate: 10,
    tenureMonths: 48,
    processingFeePercentage: 1.5,
    description:
      "Borrowing for a two-wheeler, car, commercial vehicle, or EV.",
  },

  home: {
    purpose: "home",
    label: "Home",
    annualInterestRate: 8.5,
    tenureMonths: 240,
    processingFeePercentage: 1,
    description:
      "Long-term borrowing for buying, building, or improving a home.",
  },

  education: {
    purpose: "education",
    label: "Education",
    annualInterestRate: 9.5,
    tenureMonths: 84,
    processingFeePercentage: 1,
    description:
      "Borrowing for higher education or professional learning.",
  },

  other: {
    purpose: "other",
    label: "Other",
    annualInterestRate: 14,
    tenureMonths: 36,
    processingFeePercentage: 2,
    description:
      "General-purpose borrowing assessed using conservative assumptions.",
  },
};

export function getLoanProduct(
  purpose?: LoanPurpose,
): LoanProductConfig {
  return loanProducts[purpose ?? "other"];
}