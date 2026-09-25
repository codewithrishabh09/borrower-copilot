import {
  Check,
  Copy,
  Download,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import type { BorrowerAnalysisResult } from "../engine/borrowerAnalyzer";

interface NegotiationCardProps {
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

export default function NegotiationCard({
  analysis,
}: NegotiationCardProps) {
  const [copied, setCopied] = useState(false);

  const summary = [
    "Borrower Copilot — Borrowing Position",
    `Requested amount: ${formatCurrency(
      analysis.requestedLoan.amount,
    )}`,
    `Assessed safe amount: ${formatCurrency(
      analysis.affordableLoanAmount,
    )}`,
    `Safe monthly EMI: ${formatCurrency(
      analysis.affordability.safeMonthlyEmi,
    )}`,
    `Fair interest range: ${analysis.interestRate.fairRateMin}%–${analysis.interestRate.fairRateMax}%`,
    `Estimated APR: ${analysis.apr.estimatedApr}%`,
    `Confidence: ${analysis.decision.confidenceScore}%`,
  ].join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="print-negotiation-card relative overflow-hidden rounded-[30px] border border-[#8A4D7B]/25 bg-gradient-to-br from-[#1D1320] via-[#120E14] to-[#0C090D] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-9">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#8A4D7B]/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8A4D7B]/15 text-[#D5A9CA]">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A66A96]">
                Negotiation intelligence
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Your borrowing position
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#817783]">
                Use these numbers as a structured starting
                point when comparing lender offers.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#D7CFD4] transition hover:bg-white/[0.08]"
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
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8A4D7B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A66A96]"
            >
              <Download size={15} />
              Print
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NegotiationMetric
            label="Requested"
            value={formatCurrency(
              analysis.requestedLoan.amount,
            )}
          />

          <NegotiationMetric
            label="Safe amount"
            value={formatCurrency(
              analysis.affordableLoanAmount,
            )}
            featured
          />

          <NegotiationMetric
            label="Safe EMI"
            value={formatCurrency(
              analysis.affordability.safeMonthlyEmi,
            )}
          />

          <NegotiationMetric
            label="Fair rate"
            value={`${analysis.interestRate.fairRateMin}%–${analysis.interestRate.fairRateMax}%`}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-5">
          <p className="text-xs font-semibold text-[#E5DEE3]">
            {analysis.negotiation.headline}
          </p>

          <p className="mt-2 text-sm leading-6 text-[#817783]">
            {analysis.negotiation.summary}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {analysis.negotiation.suggestions
            .slice(0, 4)
            .map((suggestion) => (
              <div
                key={suggestion.title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#E5DEE3]">
                    {suggestion.title}
                  </p>

                  <span className="text-[9px] font-bold tracking-[0.12em] text-[#A66A96]">
                    {suggestion.priority}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#817783]">
                  {suggestion.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function NegotiationMetric({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        featured
          ? "border-[#A66A96]/25 bg-[#A66A96]/[0.08]"
          : "border-white/[0.07] bg-white/[0.025]"
      }`}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#716873]">
        {label}
      </p>

      <p
        className={`fintech-number mt-2 text-lg font-semibold ${
          featured
            ? "text-[#D5A9CA]"
            : "text-[#E5DEE3]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}