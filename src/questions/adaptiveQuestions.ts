import type { Question } from "./mustQuestions";

export const adaptiveQuestions: Question[] = [
  /*
   * =========================
   * SALARIED BORROWER
   * =========================
   */

  {
    id: "employmentYears",

    type: "number",

    title:
      "How long have you been in your current employment?",

    description:
      "Employment stability can affect income reliability and borrowing risk.",

    required: true,

    suffix: "years",

    placeholder: "For example, 3",

    dependsOn: {
      questionId: "incomeType",

      value: "salaried",
    },
  },

  {
    id: "emergencySavingsMonths",

    type: "number",

    title:
      "How many months of expenses can your savings cover?",

    description:
      "Savings provide a buffer if your income is temporarily interrupted.",

    required: true,

    suffix: "months",

    placeholder: "For example, 6",

    dependsOn: {
      questionId: "incomeType",

      value: "salaried",
    },
  },

  /*
   * =========================
   * SELF-EMPLOYED BORROWER
   * =========================
   */

  {
    id: "businessYears",

    type: "number",

    title:
      "How long has your business been operating?",

    description:
      "Business stability helps us estimate how reliable your income may be.",

    required: true,

    suffix: "years",

    placeholder: "For example, 4",

    dependsOn: {
      questionId: "incomeType",

      value: "self_employed",
    },
  },

  {
    id: "annualItrIncome",

    type: "number",

    title:
      "What annual income do you report in your latest ITR?",

    description:
      "Reported income can be different from average cash flow and helps improve confidence.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 1200000",

    dependsOn: {
      questionId: "incomeType",

      value: "self_employed",
    },
  },

  {
    id: "emergencySavingsMonths",

    type: "number",

    title:
      "How many months of expenses can your savings cover?",

    description:
      "Savings can protect your ability to repay during slower business periods.",

    required: true,

    suffix: "months",

    placeholder: "For example, 6",

    dependsOn: {
      questionId: "incomeType",

      value: "self_employed",
    },
  },

  /*
   * =========================
   * INFORMAL / VARIABLE INCOME
   * =========================
   */

  {
    id: "minimumMonthlyIncome",

    type: "number",

    title:
      "What is your lowest typical monthly income?",

    description:
      "We use your lower-income months to avoid making your loan plan too optimistic.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 30000",

    dependsOn: {
      questionId: "incomeType",

      value: "informal",
    },
  },

  {
    id: "maximumMonthlyIncome",

    type: "number",

    title:
      "What is your highest typical monthly income?",

    description:
      "This helps us understand how much your income varies.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 70000",

    dependsOn: {
      questionId: "incomeType",

      value: "informal",
    },
  },

  {
    id: "emergencySavingsMonths",

    type: "number",

    title:
      "How many months of expenses can your savings cover?",

    description:
      "Savings are especially important when your income varies from month to month.",

    required: true,

    suffix: "months",

    placeholder: "For example, 6",

    dependsOn: {
      questionId: "incomeType",

      value: "informal",
    },
  },

  /*
   * =========================
   * LOAN-SPECIFIC QUESTIONS
   * =========================
   */

  {
    id: "hasCoApplicant",

    type: "yes_no",

    title: "Do you have a co-applicant?",

    description:
      "A co-applicant may affect likely eligibility, but we will still calculate your individual safety limit.",

    required: true,

    options: [
      {
        label: "No",

        value: "false",
      },

      {
        label: "Yes",

        value: "true",
      },
    ],

    dependsOn: {
      questionId: "loanPurpose",

      value: "home",
    },
  },

  {
    id: "collateralValue",

    type: "number",

    title:
      "What is the approximate value of the collateral?",

    description:
      "Enter the estimated market value of the asset you plan to use as collateral.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 1500000",

    dependsOn: {
      questionId: "loanPurpose",

      value: "business",
    },
  },

  /*
   * =========================
   * GOLD LOAN QUESTIONS
   * =========================
   */

  {
    id: "goldEstimatedValue",

    type: "number",

    title:
      "What is the estimated value of the gold you plan to pledge?",

    description:
      "Enter your approximate estimate. The lender's final valuation may be different.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 500000",

    dependsOn: {
      questionId: "loanPurpose",

      value: "gold",
    },
  },

  {
    id: "hasExistingGoldLoan",

    type: "yes_no",

    title:
      "Do you already have another loan against gold?",

    description:
      "Existing borrowing against gold can increase repayment pressure and overall risk.",

    required: true,

    options: [
      {
        label: "No",

        value: "false",
      },

      {
        label: "Yes",

        value: "true",
      },
    ],

    dependsOn: {
      questionId: "loanPurpose",

      value: "gold",
    },
  },

  {
    id: "upcomingLargeExpense",

    type: "yes_no",

    title:
      "Do you expect a major expense in the next 12 months?",

    description:
      "A large upcoming expense can reduce the amount of monthly EMI you can safely carry.",

    required: true,

    options: [
      {
        label: "No",

        value: "false",
      },

      {
        label: "Yes",

        value: "true",
      },
    ],
  },
];