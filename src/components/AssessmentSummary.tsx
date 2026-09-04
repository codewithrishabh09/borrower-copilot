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
  const [copied, setCopied] = useState(false);

  const summary = `
Borrower Copilot — Assessment Summary

Recommendation: ${analysis.decision.recommendation.replace(
    /_/g,
    " ",
  )}

Requested amount: ${formatCurrency(
    analysis.requestedLoan.amount,
  )}

Recommended amount: ${formatCurrency(
    analysis.decision.recommendedLoanAmount,
  )}

Requested EMI: ${formatCurrency(
    analysis.requestedLoan.monthlyEmi,
  )}

Safe monthly EMI: ${formatCurrency(
    analysis.affordability.safeMonthlyEmi,
  )}

Estimated APR: ${analysis.apr.estimatedApr}%

Confidence: ${analysis.decision.confidenceScore}%

This is an educational affordability assessment and not a loan approval.
`.trim();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Borrower Copilot Assessment",
          text: summary,
        });
      } catch {
        // User cancelled sharing.
      }

      return;
    }

    await handleCopy();
  }

  return (
    <section className="rounded-2xl border border-[#E6DFE2] bg-white p-6 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Assessment summary
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#756A70]">
            Save or share a concise summary of your
            borrowing assessment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DED3D9] px-4 py-2.5 text-sm font-semibold text-[#643652] transition hover:bg-[#F8F3F6]"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4B2440] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#643652]"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#EAE4E6] bg-[#FAF9F8] p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#756A70]">
          {summary}
        </pre>
      </div>
    </section>
  );
}