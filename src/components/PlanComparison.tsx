import {
  ArrowDownRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import type { BorrowerAnalysisResult } from "../engine/borrowerAnalyzer";

interface PlanComparisonProps {
  analysis: BorrowerAnalysisResult;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PlanComparison({
  analysis,
}: PlanComparisonProps) {
  const requestedAmount =
    analysis.requestedLoan.amount;

  const recommendedAmount =
    analysis.decision.recommendedLoanAmount;

  const requestedEmi =
    analysis.requestedLoan.monthlyEmi;

  const safeEmi =
    analysis.affordability.safeMonthlyEmi;

  const amountDifference = Math.max(
    requestedAmount - recommendedAmount,
    0,
  );

  const emiDifference = Math.max(
    requestedEmi - safeEmi,
    0,
  );

  const isAlreadySafe =
    analysis.decision.recommendation === "BORROW";

  return (
    <section className="rounded-2xl border border-[#E6DFE2] bg-white p-6 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Requested plan vs safer plan
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#756A70]">
            Compare your current borrowing request with a
            more conservative affordability-based option.
          </p>
        </div>

        {isAlreadySafe ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Within safe range
          </div>
        ) : (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F3EEF1] px-3 py-1.5 text-xs font-semibold text-[#643652]">
            <ShieldCheck size={14} />
            Safer alternative
          </div>
        )}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {/* Requested Plan */}
        <div className="rounded-2xl border border-[#EAE4E6] bg-[#FAF9F8] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#756A70]">
            Your requested plan
          </p>

          <div className="mt-5 space-y-5">
            <PlanMetric
              label="Loan amount"
              value={formatCurrency(requestedAmount)}
            />

            <PlanMetric
              label="Monthly EMI"
              value={formatCurrency(requestedEmi)}
            />
          </div>
        </div>

        {/* Safer Plan */}
        <div className="rounded-2xl border border-[#4B2440] bg-[#F8F3F6] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#643652]">
            Recommended safer plan
          </p>

          <div className="mt-5 space-y-5">
            <PlanMetric
              label="Loan amount"
              value={formatCurrency(recommendedAmount)}
              highlight
            />

            <PlanMetric
              label="Safe monthly EMI"
              value={formatCurrency(safeEmi)}
              highlight
            />
          </div>
        </div>
      </div>

      {!isAlreadySafe && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <ArrowDownRight
              size={19}
              className="mt-0.5 shrink-0 text-amber-700"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                What changes with the safer plan?
              </p>

              <div className="mt-2 space-y-1 text-sm leading-6 text-amber-800">
                {amountDifference > 0 && (
                  <p>
                    Borrow{" "}
                    {formatCurrency(amountDifference)} less.
                  </p>
                )}

                {emiDifference > 0 && (
                  <p>
                    Reduce monthly EMI pressure by{" "}
                    {formatCurrency(emiDifference)}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

interface PlanMetricProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function PlanMetric({
  label,
  value,
  highlight = false,
}: PlanMetricProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <span className="text-sm text-[#756A70]">
        {label}
      </span>

      <span
        className={`text-base ${
          highlight
            ? "font-semibold text-[#4B2440]"
            : "font-semibold text-[#211A1E]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}