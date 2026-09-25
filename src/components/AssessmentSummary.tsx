import {
  Check,
  Copy,
  Share2,
} from "lucide-react";
import { useState } from "react";

import type { BorrowerAnalysisResult } from "../engine/borrowerAnalyzer";

interface AssessmentSummaryProps {
  analysis: BorrowerAnalysisResult;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AssessmentSummary({
  analysis,
}: AssessmentSummaryProps) {
  const [copied, setCopied] =
    useState(false);

  const summary =
    `Borrower Copilot — Assessment Summary\n\n` +
    `Recommendation: ${analysis.decision.recommendation.replace(
      /_/g,
      " ",
    )}\n` +
    `Requested amount: ${formatCurrency(
      analysis.requestedLoan.amount,
    )}\n` +
    `Recommended amount: ${formatCurrency(
      analysis.decision.recommendedLoanAmount,
    )}\n` +
    `Requested EMI: ${formatCurrency(
      analysis.requestedLoan.monthlyEmi,
    )}\n` +
    `Safe monthly EMI: ${formatCurrency(
      analysis.affordability.safeMonthlyEmi,
    )}\n` +
    `Estimated APR: ${analysis.apr.estimatedApr}%\n` +
    `Confidence: ${analysis.decision.confidenceScore}%\n\n` +
    `This is an educational affordability assessment and not a loan approval.`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        summary,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title:
            "Borrower Copilot Assessment",
          text: summary,
        });
      } catch {
        // Sharing was cancelled or unavailable.
      }

      return;
    }

    await handleCopy();
  }

  return (
    <section className="fintech-card rounded-[26px] p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A66A96]">
            Exportable snapshot
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Assessment summary
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#817783]">
            Save or share the key figures from this
            assessment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-[#D7CFD4] transition hover:bg-white/[0.07]"
          >
            {copied ? (
              <Check size={15} />
            ) : (
              <Copy size={15} />
            )}

            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6D3B63] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8A4D7B]"
          >
            <Share2 size={15} />
            Share
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryMetric
          label="Recommendation"
          value={analysis.decision.recommendation.replace(
            /_/g,
            " ",
          )}
        />

        <SummaryMetric
          label="Safe amount"
          value={formatCurrency(
            analysis.affordableLoanAmount,
          )}
        />

        <SummaryMetric
          label="Safe EMI"
          value={formatCurrency(
            analysis.affordability.safeMonthlyEmi,
          )}
        />

        <SummaryMetric
          label="Confidence"
          value={`${analysis.decision.confidenceScore}%`}
        />
      </div>
    </section>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#716873]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold capitalize text-[#E5DEE3]">
        {value}
      </p>
    </div>
  );
}