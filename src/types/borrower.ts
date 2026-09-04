export type IncomeType =
  | "salaried"
  | "self_employed"
  | "informal";

export type LoanPurpose =
  | "personal"
  | "business"
  | "vehicle"
  | "home"
  | "education"
  | "other";

export type CreditScoreStatus =
  | "known"
  | "unknown";

export type RiskLevel =
  | "low"
  | "medium"
  | "high";

export type ConfidenceLevel =
  | "low"
  | "medium"
  | "high";

export type BorrowDecision =
  | "borrow"
  | "borrow_less"
  | "dont_borrow";

export interface BorrowerProfile {
  loanPurpose?: LoanPurpose;

  requestedAmount?: number;

  incomeType?: IncomeType;

  monthlyIncome?: number;

  minimumMonthlyIncome?: number;

  maximumMonthlyIncome?: number;

  existingEmi?: number;

  monthlyExpenses?: number;

  age?: number;

  creditScoreStatus?: CreditScoreStatus;

  creditScore?: number;

  recentMissedPayment?: boolean;

  emergencySavingsMonths?: number;

  employmentYears?: number;

  businessYears?: number;

  annualItrIncome?: number;

  collateralValue?: number;

  hasCoApplicant?: boolean;

  upcomingLargeExpense?: boolean;
}

export interface BorrowerAnswer {
  questionId: string;

  value: string | number | boolean | undefined;
}

export interface BorrowerResult {
  decision: BorrowDecision;

  safeMonthlyEmi: number;

  safeLoanAmount: number;

  likelySanctionAmount: number;

  fairRateMin: number;

  fairRateMax: number;

  estimatedApr: number;

  riskLevel: RiskLevel;

  confidence: ConfidenceLevel;

  explanation: string;
}