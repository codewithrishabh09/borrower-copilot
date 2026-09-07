export type QuestionType =
  | "single_select"
  | "number"
  | "yes_no";

export interface QuestionOption {
  label: string;

  value: string;

  description?: string;
}

export interface Question {
  id: string;

  type: QuestionType;

  title: string;

  description?: string;

  required: boolean;

  placeholder?: string;

  prefix?: string;

  suffix?: string;

  options?: QuestionOption[];

  dependsOn?: {
    questionId: string;

    value: string | boolean;
  };
}

export const mustQuestions: Question[] = [
  {
    id: "loanPurpose",

    type: "single_select",

    title: "What do you need the loan for?",

    description:
      "The purpose helps us choose the right affordability and risk rules.",

    required: true,

    options: [
      {
        label: "Personal expense",

        value: "personal",

        description:
          "Wedding, medical, travel, or other personal expenses.",
      },

      {
        label: "Business",

        value: "business",

        description:
          "Working capital, inventory, expansion, or equipment.",
      },

      {
        label: "Vehicle",

        value: "vehicle",

        description:
          "Two-wheeler, car, commercial vehicle, or EV.",
      },

      {
        label: "Home",

        value: "home",

        description:
          "Buying, building, or improving a home.",
      },

      {
        label: "Education",

        value: "education",

        description:
          "Higher education or professional learning.",
      },

      /*
       * GOLD LOAN OPTION
       */
      {
        label: "Gold Loan",

        value: "gold",

        description:
          "Borrowing against eligible gold jewellery.",
      },

      {
        label: "Other",

        value: "other",
      },
    ],
  },

  {
    id: "requestedAmount",

    type: "number",

    title: "How much do you want to borrow?",

    description:
      "Enter the amount you currently plan to request from a lender.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 800000",
  },

  {
    id: "incomeType",

    type: "single_select",

    title: "How do you earn your income?",

    description:
      "This changes the questions and rules we use for your assessment.",

    required: true,

    options: [
      {
        label: "Salaried",

        value: "salaried",

        description:
          "You receive a regular salary from an employer.",
      },

      {
        label: "Self-employed",

        value: "self_employed",

        description:
          "You run a business or work independently.",
      },

      {
        label: "Informal or variable income",

        value: "informal",

        description:
          "Your income may vary and may not come from a traditional salary.",
      },
    ],
  },

  {
    id: "monthlyIncome",

    type: "number",

    title: "What is your average monthly net income?",

    description:
      "Use the amount you receive after regular deductions.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 110000",
  },

  {
    id: "existingEmi",

    type: "number",

    title: "What is your total existing monthly EMI?",

    description:
      "Include EMIs for all active loans. Enter 0 if you do not currently pay any.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 14000",
  },

  {
    id: "monthlyExpenses",

    type: "number",

    title: "What are your average monthly household expenses?",

    description:
      "Include rent, food, utilities, education, and regular household costs.",

    required: true,

    prefix: "₹",

    placeholder: "For example, 28000",
  },

  {
    id: "age",

    type: "number",

    title: "How old are you?",

    description:
      "Your age can affect likely tenure and lender eligibility.",

    required: true,

    suffix: "years",

    placeholder: "For example, 29",
  },

  {
    id: "creditScoreStatus",

    type: "single_select",

    title: "Do you know your credit score?",

    description:
      "If you do not know it, we will treat it as unknown—not as a poor score.",

    required: true,

    options: [
      {
        label: "Yes, I know it",

        value: "known",
      },

      {
        label: "No, I don't know",

        value: "unknown",
      },
    ],
  },

  {
    id: "creditScore",

    type: "number",

    title: "What is your credit score?",

    description:
      "Enter your latest known credit score.",

    required: true,

    placeholder: "For example, 780",

    dependsOn: {
      questionId: "creditScoreStatus",

      value: "known",
    },
  },

  {
    id: "recentMissedPayment",

    type: "yes_no",

    title: "Have you missed or bounced an EMI recently?",

    description:
      "A recent missed payment can significantly affect borrowing safety.",

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