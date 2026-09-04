import {
  Download,
  Landmark,
  ShieldCheck,
  MessageSquareText,
} from "lucide-react";

import type { BorrowerAnalysisResult } from "../engine/borrowerAnalyzer";

interface NegotiationCardProps {
  analysis: BorrowerAnalysisResult;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NegotiationCard({
  analysis,
}: NegotiationCardProps) {
  const {
    decision,
    affordability,
    apr,
    negotiation,
  } = analysis;

  const recommendationText =
    decision.recommendation === "BORROW"
      ? "The requested borrowing level appears to be within the calculated affordability range."
      : decision.recommendation === "BORROW_LESS"
        ? "A lower borrowing amount may better match the calculated affordability range."
        : "The current borrowing request may create significant financial pressure.";

  return (
    <section className="print-negotiation-card overflow-hidden rounded-3xl border border-[#4B2440] bg-[#4B2440] text-white shadow-sm">
      {/* Header */}
      <div className="border-b border-white/15 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              <Landmark size={15} />

              Borrower Copilot
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Negotiation Card
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              A transparent affordability summary you can
              use before discussing loan terms with a lender.
            </p>
          </div>

          <div className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold">
            Self-assessment
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <CardMetric
          label="Recommended borrowing limit"
          value={formatCurrency(
            decision.recommendedLoanAmount,
          )}
        />

        <CardMetric
          label="Safe monthly EMI"
          value={formatCurrency(
            affordability.safeMonthlyEmi,
          )}
        />

        <CardMetric
          label="Estimated APR"
          value={`${apr.estimatedApr}%`}
        />

        <CardMetric
          label="Requested loan amount"
          value={formatCurrency(
            analysis.requestedLoan.amount,
          )}
        />
      </div>

      {/* Assessment Recommendation */}
      <div className="mx-6 rounded-2xl bg-white/10 p-5 sm:mx-8">
        <div className="flex gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-white"
          />

          <div>
            <p className="text-sm font-semibold">
              Assessment recommendation
            </p>

            <p className="mt-2 text-sm leading-6 text-white/70">
              {recommendationText}
            </p>
          </div>
        </div>
      </div>

      {/* Negotiation Strategy */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <MessageSquareText
            size={18}
            className="text-white/70"
          />

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
            Your negotiation strategy
          </p>
        </div>

        <h3 className="mt-4 text-xl font-semibold">
          {negotiation.headline}
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          {negotiation.summary}
        </p>

        {negotiation.suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            {negotiation.suggestions.map(
              (suggestion, index) => (
                <div
                  key={`${suggestion.title}-${index}`}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">
                        {suggestion.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-white/70">
                        {suggestion.description}
                      </p>
                    </div>

                    <PriorityBadge
                      priority={suggestion.priority}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Talking Points */}
      <div className="border-t border-white/15 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Questions to discuss with your lender
        </p>

        <ul className="mt-4 space-y-3 text-sm text-white/80">
          <li>
            • Can the interest rate be improved based on my
            financial profile?
          </li>

          <li>
            • What fees are included beyond the stated
            interest rate?
          </li>

          <li>
            • What will be the total amount I repay over the
            full loan tenure?
          </li>

          <li>
            • Can the EMI be adjusted to remain within my safe
            monthly limit?
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-white/15 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="max-w-xl text-xs leading-5 text-white/50">
          This is an educational affordability assessment,
          not a loan approval or financial guarantee.
        </p>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#4B2440] transition hover:bg-white/90"
        >
          <Download size={16} />

          Save / Print
        </button>
      </div>
    </section>
  );
}

interface CardMetricProps {
  label: string;
  value: string;
}

function CardMetric({
  label,
  value,
}: CardMetricProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
      <p className="text-xs text-white/55">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}

interface PriorityBadgeProps {
  priority: "HIGH" | "MEDIUM" | "LOW";
}

function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  const priorityStyles = {
    HIGH: "bg-white text-[#4B2440]",
    MEDIUM:
      "border border-white/25 bg-white/10 text-white",
    LOW:
      "border border-white/15 bg-transparent text-white/70",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em] ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  );
}