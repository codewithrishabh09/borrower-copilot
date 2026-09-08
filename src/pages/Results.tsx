import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Gem,
  ShieldAlert,
  TrendingDown,
} from "lucide-react";

import type { ReactNode } from "react";

import type { BorrowerAnalysisResult } from "../engine/borrowerAnalyzer";

import {
  generateRecommendations,
  type BorrowerRecommendation,
} from "../engine/recommendationEngine";

import PlanComparison from "../components/PlanComparison";

import AssessmentSummary from "../components/AssessmentSummary";

interface ResultsProps {
  analysis: BorrowerAnalysisResult;
  onStartAgain: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getRecommendationConfig(
  recommendation:
    | "BORROW"
    | "BORROW_LESS"
    | "DO_NOT_BORROW",
) {
  switch (recommendation) {
    case "BORROW":
      return {
        title: "You can consider borrowing",
        label: "BORROW",
        description:
          "Based on the information provided, the requested borrowing amount appears to be within the calculated affordability limits.",
        icon: CheckCircle2,
        color: "text-emerald-700",
        background: "bg-emerald-50",
        border: "border-emerald-200",
      };

    case "BORROW_LESS":
      return {
        title: "Consider borrowing less",
        label: "BORROW LESS",
        description:
          "Your requested amount may place additional pressure on your monthly finances. A lower amount appears more manageable.",
        icon: TrendingDown,
        color: "text-amber-700",
        background: "bg-amber-50",
        border: "border-amber-200",
      };

    case "DO_NOT_BORROW":
      return {
        title: "Borrowing may not be safe right now",
        label: "DO NOT BORROW",
        description:
          "Based on the affordability and risk checks, taking on this additional debt could place significant pressure on your finances.",
        icon: ShieldAlert,
        color: "text-red-700",
        background: "bg-red-50",
        border: "border-red-200",
      };
  }
}

function getGoldLimitingFactorMessage(
  limitingFactor:
    | "gold_value"
    | "monthly_affordability"
    | "both",
) {
  switch (limitingFactor) {
    case "gold_value":
      return {
        title: "Your gold value is the main limit",
        description:
          "Your estimated gold value currently places a lower limit on the amount you can safely borrow.",
      };

    case "monthly_affordability":
      return {
        title: "Your monthly affordability is the main limit",
        description:
          "Your repayment capacity places a lower limit on the amount you can safely borrow than the value of your gold.",
      };

    case "both":
      return {
        title: "Both factors are equally limiting",
        description:
          "Your gold-backed borrowing limit and monthly affordability limit are currently at approximately the same level.",
      };
  }
}

export default function Results({
  analysis,
  onStartAgain,
}: ResultsProps) {
  const recommendationConfig = getRecommendationConfig(
    analysis.decision.recommendation,
  );

  const RecommendationIcon = recommendationConfig.icon;

  const recommendationResult =
    generateRecommendations(analysis);

  const goldLoan = analysis.goldLoan;

  const goldLimitMessage = goldLoan
    ? getGoldLimitingFactorMessage(
        goldLoan.limitingFactor,
      )
    : null;

  return (
    <main className="min-h-screen bg-[#FAF9F8] text-[#211A1E]">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#E6E0E2] pb-6">
          <div className="flex items-center gap-3">

            {/* Logo */}
            <img
              src="/borrower-copilot-logo.png"
              alt="Borrower Copilot"
              className="h-10 w-10 rounded-xl object-contain"
            />

            <div>
              <h1 className="font-semibold">
                Borrower Copilot
              </h1>

              <p className="text-xs text-[#756A70]">
                Your borrowing assessment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartAgain}
            className="hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#756A70] transition hover:bg-[#F1ECEE] sm:inline-flex"
          >
            <ArrowLeft size={17} />
            Start again
          </button>
        </header>

        {/* Recommendation Hero */}
        <section
          className={`mt-10 rounded-3xl border p-8 sm:p-10 ${recommendationConfig.background} ${recommendationConfig.border}`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border border-current px-3 py-1 text-xs font-bold tracking-[0.12em] ${recommendationConfig.color}`}
              >
                <RecommendationIcon size={15} />

                {recommendationConfig.label}
              </div>

              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {recommendationConfig.title}
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-[#756A70]">
                {recommendationConfig.description}
              </p>
            </div>

            <div className="rounded-2xl bg-white/70 px-5 py-4 text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-[#756A70]">
                Confidence
              </p>

              <p className="mt-1 text-3xl font-semibold">
                {analysis.decision.confidenceScore}%
              </p>
            </div>
          </div>
        </section>

        {/* Main Metrics */}
        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <MetricCard
            label="Requested amount"
            value={formatCurrency(
              analysis.requestedLoan.amount,
            )}
            description="Amount you want to borrow"
          />

          <MetricCard
            label={
              goldLoan
                ? "Your gold-backed safe amount"
                : "Your safe amount"
            }
            value={formatCurrency(
              analysis.affordableLoanAmount,
            )}
            description={
              goldLoan
                ? "Based on both affordability and estimated gold value"
                : "Conservative amount based on affordability"
            }
            highlight
          />

          <MetricCard
            label="Likely lender sanction"
            value={formatCurrency(
              analysis.eligibility.likelySanctionAmount,
            )}
            description="Estimated lender-side eligibility"
          />

          <MetricCard
            label="Safe monthly EMI"
            value={formatCurrency(
              analysis.affordability.safeMonthlyEmi,
            )}
            description="Maximum recommended new EMI"
          />

          <MetricCard
            label="Fair interest rate"
            value={`${analysis.interestRate.fairRateMin}% – ${analysis.interestRate.fairRateMax}%`}
            description="Estimated rate range based on your profile"
          />

          <MetricCard
            label="Estimated APR"
            value={`${analysis.apr.estimatedApr}%`}
            description="Includes estimated borrowing costs"
          />

        </section>

        {/* Gold Loan Snapshot */}
        {goldLoan && goldLimitMessage && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-[#E5D7C7] bg-[#FFFCF6]">

            <div className="border-b border-[#EDE2D4] bg-[#FFF8EC] px-6 py-5 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E3C2] text-[#8A5A13]">
                    <Gem size={21} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#E5C98C] bg-[#FFF5DC] px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#8A5A13]">
                        GOLD LOAN
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-semibold">
                      Gold Loan Snapshot
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#756A70]">
                      Your safe borrowing amount is checked against both your repayment capacity and the estimated value of your gold.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E7D6BC] bg-white px-4 py-3 sm:text-right">
                  <p className="text-xs font-medium text-[#756A70]">
                    Final safe amount
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#4B2440]">
                    {formatCurrency(
                      goldLoan.finalSafeAmount,
                    )}
                  </p>
                </div>

              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-7">

              <GoldMetric
                label="Estimated gold value"
                value={formatCurrency(
                  goldLoan.estimatedGoldValue,
                )}
                description="Estimated value you provided"
              />

              <GoldMetric
                label="Conservative LTV"
                value={`${goldLoan.conservativeLtvPercentage}%`}
                description="Internal assessment limit"
              />

              <GoldMetric
                label="Gold-backed limit"
                value={formatCurrency(
                  goldLoan.maxLoanByGoldValue,
                )}
                description="Maximum based on estimated gold value"
              />

              <GoldMetric
                label="Affordability limit"
                value={formatCurrency(
                  goldLoan.affordabilityBasedLoanAmount,
                )}
                description="Maximum based on monthly repayment capacity"
              />

            </div>

            <div className="mx-6 mb-6 rounded-xl border border-[#E9DDD1] bg-white p-5 sm:mx-7 sm:mb-7">

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#756A70]">
                Primary limiting factor
              </p>

              <h4 className="mt-2 text-base font-semibold">
                {goldLimitMessage.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#756A70]">
                {goldLimitMessage.description}
              </p>

            </div>

          </section>
        )}

        {/* Main Content */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left Column */}
          <div className="space-y-8">

            <ResultCard title="Why this recommendation">
              <div className="space-y-4">

                {analysis.decision.reasons.map(
                  (reason) => (
                    <div
                      key={reason}
                      className="flex gap-3"
                    >
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <p className="text-sm leading-6 text-[#756A70]">
                        {reason}
                      </p>
                    </div>
                  ),
                )}

                {analysis.decision.warnings.map(
                  (warning) => (
                    <div
                      key={warning}
                      className="flex gap-3"
                    >
                      <AlertTriangle
                        size={19}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />

                      <p className="text-sm leading-6 text-[#756A70]">
                        {warning}
                      </p>
                    </div>
                  ),
                )}

              </div>
            </ResultCard>

            <ResultCard title="What you can do next">
              <p className="mb-6 text-sm leading-6 text-[#756A70]">
                These recommendations are based on your
                income, affordability limits, borrowing
                costs, and stress test results.
              </p>

              <div className="space-y-4">
                {recommendationResult.recommendations.map(
                  (recommendation) => (
                    <ActionRecommendation
                      key={recommendation.id}
                      recommendation={recommendation}
                    />
                  ),
                )}
              </div>
            </ResultCard>

            <PlanComparison analysis={analysis} />

            <ResultCard title="Income stress test">
              <p className="mb-6 text-sm leading-6 text-[#756A70]">
                This shows how the proposed EMI performs
                if your income decreases.
              </p>

              <div className="space-y-3">
                {analysis.stressTest.scenarios.map(
                  (scenario) => (
                    <div
                      key={scenario.incomeDropPercentage}
                      className="flex items-center justify-between rounded-xl border border-[#EAE4E6] p-4"
                    >
                      <div>
                        <p className="font-medium">
                          Income drops{" "}
                          {scenario.incomeDropPercentage}%
                        </p>

                        <p className="mt-1 text-xs text-[#756A70]">
                          Stressed income:{" "}
                          {formatCurrency(
                            scenario.stressedIncome,
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            scenario.isAffordable
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {scenario.isAffordable
                            ? "Affordable"
                            : "Not safe"}
                        </p>

                        <p className="mt-1 text-xs text-[#756A70]">
                          EMI ratio:{" "}
                          {scenario.emiToIncomeRatio}%
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </ResultCard>

          </div>

          {/* Right Column */}
          <div className="space-y-8">

            <ResultCard title="Borrowing cost">
              <div className="space-y-5">

                <CostRow
                  label="Monthly EMI"
                  value={formatCurrency(
                    analysis.requestedLoan.monthlyEmi,
                  )}
                />

                <CostRow
                  label="Estimated APR"
                  value={`${analysis.apr.estimatedApr}%`}
                />

                <CostRow
                  label="Processing fee"
                  value={formatCurrency(
                    analysis.apr.processingFee,
                  )}
                />

                <CostRow
                  label="Total interest"
                  value={formatCurrency(
                    analysis.apr.totalInterest,
                  )}
                />

                <CostRow
                  label="Net amount received"
                  value={formatCurrency(
                    analysis.apr.netDisbursedAmount,
                  )}
                  strong
                />

              </div>
            </ResultCard>

            <ResultCard title="Financial snapshot">
              <div className="space-y-5">

                <CostRow
                  label="Usable monthly income"
                  value={formatCurrency(
                    analysis.income.usableMonthlyIncome,
                  )}
                />

                <CostRow
                  label="Monthly expenses"
                  value={formatCurrency(
                    analysis.affordability.monthlyExpenses,
                  )}
                />

                <CostRow
                  label="Existing EMI"
                  value={formatCurrency(
                    analysis.affordability.existingEmi,
                  )}
                />

                <CostRow
                  label="Disposable income"
                  value={formatCurrency(
                    analysis.affordability.disposableIncome,
                  )}
                  strong
                />

              </div>
            </ResultCard>

            <AssessmentSummary analysis={analysis} />

            <ResultCard title="Negotiation guidance">
              <div className="space-y-5">

                <div>
                  <h4 className="text-base font-semibold text-[#211A1E]">
                    {analysis.negotiation.headline}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#756A70]">
                    {analysis.negotiation.summary}
                  </p>
                </div>

                <div className="space-y-4">

                  {analysis.negotiation.suggestions.map(
                    (suggestion) => (
                      <div
                        key={suggestion.title}
                        className="rounded-xl border border-[#EAE4E6] bg-[#FAF9F8] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <h5 className="text-sm font-semibold text-[#211A1E]">
                              {suggestion.title}
                            </h5>

                            <p className="mt-1.5 text-sm leading-6 text-[#756A70]">
                              {suggestion.description}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                              suggestion.priority === "HIGH"
                                ? "bg-red-50 text-red-700"
                                : suggestion.priority === "MEDIUM"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-[#F1ECEE] text-[#643652]"
                            }`}
                          >
                            {suggestion.priority}
                          </span>

                        </div>
                      </div>
                    ),
                  )}

                </div>
              </div>
            </ResultCard>

          </div>

        </section>

        {/* Mobile Start Again */}
        <button
          type="button"
          onClick={onStartAgain}
          className="mt-10 w-full rounded-xl bg-[#4B2440] px-5 py-4 text-sm font-semibold text-white sm:hidden"
        >
          Start new assessment
        </button>

      </div>
    </main>
  );
}

/* ---------------------------------
   Reusable Components
---------------------------------- */

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}

function MetricCard({
  label,
  value,
  description,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlight
          ? "border-[#4B2440] bg-[#F8F3F6]"
          : "border-[#E6DFE2] bg-white"
      }`}
    >
      <p className="text-sm font-medium text-[#756A70]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#84777E]">
        {description}
      </p>
    </div>
  );
}

interface GoldMetricProps {
  label: string;
  value: string;
  description: string;
}

function GoldMetric({
  label,
  value,
  description,
}: GoldMetricProps) {
  return (
    <div className="rounded-xl border border-[#E9DED0] bg-white p-5">
      <p className="text-xs font-medium text-[#756A70]">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-[#211A1E]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#84777E]">
        {description}
      </p>
    </div>
  );
}

interface ResultCardProps {
  title: string;
  children: ReactNode;
}

function ResultCard({
  title,
  children,
}: ResultCardProps) {
  return (
    <section className="rounded-2xl border border-[#E6DFE2] bg-white p-6 sm:p-7">

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <div className="mt-6">
        {children}
      </div>

    </section>
  );
}

interface CostRowProps {
  label: string;
  value: string;
  strong?: boolean;
}

function CostRow({
  label,
  value,
  strong = false,
}: CostRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-sm text-[#756A70]">
        {label}
      </span>

      <span
        className={`text-sm ${
          strong
            ? "font-semibold text-[#211A1E]"
            : "font-medium text-[#40383C]"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

interface ActionRecommendationProps {
  recommendation: BorrowerRecommendation;
}

function ActionRecommendation({
  recommendation,
}: ActionRecommendationProps) {
  const priorityConfig = {
    high: {
      label: "HIGH PRIORITY",
      badge:
        "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },

    medium: {
      label: "MEDIUM PRIORITY",
      badge:
        "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },

    low: {
      label: "TIP",
      badge:
        "bg-[#F3EEF1] text-[#643652] border-[#DED3D9]",
      dot: "bg-[#643652]",
    },
  };

  const config =
    priorityConfig[recommendation.priority];

  return (
    <div className="rounded-xl border border-[#EAE4E6] p-5">
      <div className="flex items-start gap-3">

        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${config.dot}`}
        />

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <h4 className="font-semibold text-[#211A1E]">
              {recommendation.title}
            </h4>

            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] ${config.badge}`}
            >
              {config.label}
            </span>

          </div>

          <p className="mt-3 text-sm leading-6 text-[#756A70]">
            {recommendation.description}
          </p>

        </div>
      </div>
    </div>
  );
}