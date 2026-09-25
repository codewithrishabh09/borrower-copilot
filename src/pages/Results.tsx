import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gem,
  Gauge,
  ShieldAlert,
  TrendingDown,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

import type { BorrowerAnalysisResult } from "../engine/borrowerAnalyzer";
import {
  generateRecommendations,
  type BorrowerRecommendation,
} from "../engine/recommendationEngine";

import AssessmentSummary from "../components/AssessmentSummary";
import NegotiationCard from "../components/NegotiationCard";
import PlanComparison from "../components/PlanComparison";
import Logo from "../components/Logo";

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
  recommendation: BorrowerAnalysisResult["decision"]["recommendation"],
) {
  switch (recommendation) {
    case "BORROW":
      return {
        label: "BORROW",
        title:
          "Your request fits the assessed affordability range.",
        description:
          "The requested amount and EMI are within the calculated limits for the information provided.",
        icon: CheckCircle2,
        accent: "#39D39F",
      };

    case "BORROW_LESS":
      return {
        label: "BORROW LESS",
        title:
          "A smaller borrowing amount looks more manageable.",
        description:
          "The current request creates additional pressure against the calculated affordability or risk limits.",
        icon: TrendingDown,
        accent: "#E7A84B",
      };

    case "DO_NOT_BORROW":
      return {
        label: "DO NOT BORROW",
        title:
          "The current request may create significant repayment pressure.",
        description:
          "The assessment found affordability or risk signals that make additional borrowing less manageable right now.",
        icon: ShieldAlert,
        accent: "#E66A78",
      };
  }
}

export default function Results({
  analysis,
  onStartAgain,
}: ResultsProps) {
  const recommendation = getRecommendationConfig(
    analysis.decision.recommendation,
  );

  const RecommendationIcon = recommendation.icon;

  const recommendations =
    generateRecommendations(analysis);

  const isGoldLoan =
    analysis.profile.loanPurpose === "gold";

  const safeAmount =
    analysis.affordableLoanAmount;

  const requestedAmount =
    analysis.requestedLoan.amount;

  const capacityPercent =
    requestedAmount > 0
      ? Math.min(
          Math.round(
            (safeAmount / requestedAmount) * 100,
          ),
          100,
        )
      : 0;

  return (
    <main className="fintech-shell min-h-screen bg-[#08070A] text-[#F5F1F4]">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
        {/* =====================================
            HEADER
        ====================================== */}

        <header className="sticky top-4 z-20 mb-8 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0D0A0F]/85 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-3">
            <Logo size={40} />

            <div>
              <p className="text-sm font-semibold tracking-tight">
                Borrower Copilot
              </p>

              <p className="text-[10px] uppercase tracking-[0.14em] text-[#716873]">
                Financial intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartAgain}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-[#A59AA4] transition hover:border-[#A66A96]/30 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Start again
            </span>
          </button>
        </header>

        {/* =====================================
            RECOMMENDATION HERO
        ====================================== */}

        <section className="fintech-glow relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#17111A] via-[#100D12] to-[#0B090D] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-9 lg:p-11">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(166,106,150,0.13),transparent_30%),radial-gradient(circle_at_20%_100%,rgba(109,59,99,0.12),transparent_35%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-[0.16em]"
                  style={{
                    borderColor: `${recommendation.accent}55`,
                    color: recommendation.accent,
                    background: `${recommendation.accent}10`,
                  }}
                >
                  <RecommendationIcon size={14} />

                  {recommendation.label}
                </span>

                <span className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#716873]">
                  ASSESSMENT COMPLETE
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#716873]">
                Your borrowing position
              </p>

              <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {recommendation.title}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A59AA4] sm:text-base">
                {recommendation.description}
              </p>
            </div>

            {/* Confidence */}
            <div className="rounded-3xl border border-white/[0.08] bg-black/20 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.14em] text-[#716873]">
                  Confidence
                </p>

                <Gauge
                  size={18}
                  className="text-[#A66A96]"
                />
              </div>

              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="fintech-number text-5xl font-semibold">
                  {analysis.decision.confidenceScore}%
                </p>

                <span className="mb-1 text-xs font-semibold text-[#39D39F]">
                  {analysis.decision.riskLevel} RISK
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6D3B63] to-[#B77BA8] transition-all"
                  style={{
                    width: `${analysis.decision.confidenceScore}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            TOP METRICS
        ====================================== */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<CircleDollarSign size={18} />}
            label="Safe borrowing capacity"
            value={formatCurrency(safeAmount)}
            description="Calculated conservative limit"
            featured
          />

          <MetricCard
            icon={<Wallet size={18} />}
            label="Safe monthly EMI"
            value={formatCurrency(
              analysis.affordability.safeMonthlyEmi,
            )}
            description="Maximum assessed new EMI"
          />

          <MetricCard
            icon={<TrendingDown size={18} />}
            label="Fair interest range"
            value={`${analysis.interestRate.fairRateMin}%–${analysis.interestRate.fairRateMax}%`}
            description="Estimated profile-based range"
          />

          <MetricCard
            icon={<ArrowUpRight size={18} />}
            label="Estimated APR"
            value={`${analysis.apr.estimatedApr}%`}
            description="Effective borrowing cost"
          />
        </section>

        {/* =====================================
            CAPACITY + REPAYMENT
        ====================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="fintech-card rounded-[26px] p-6 sm:p-7">
            <SectionEyebrow>
              Borrowing capacity
            </SectionEyebrow>

            <div className="mt-3 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="fintech-number text-4xl font-semibold sm:text-5xl">
                  {formatCurrency(safeAmount)}
                </p>

                <p className="mt-2 text-sm text-[#817783]">
                  Safe amount compared with your requested
                  borrowing.
                </p>
              </div>

              <div className="min-w-[190px]">
                <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[#716873]">
                  <span>Capacity used</span>

                  <span>{capacityPercent}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6D3B63] via-[#8A4D7B] to-[#B77BA8]"
                    style={{
                      width: `${capacityPercent}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniStat
                label="Requested"
                value={formatCurrency(requestedAmount)}
              />

              <MiniStat
                label="Recommended"
                value={formatCurrency(
                  analysis.decision
                    .recommendedLoanAmount,
                )}
              />

              <MiniStat
                label="Lender estimate"
                value={formatCurrency(
                  analysis.eligibility
                    .likelySanctionAmount,
                )}
              />
            </div>
          </div>

          <div className="fintech-card rounded-[26px] p-6 sm:p-7">
            <SectionEyebrow>
              Repayment profile
            </SectionEyebrow>

            <div className="mt-5 space-y-4">
              <InfoRow
                label="Requested EMI"
                value={formatCurrency(
                  analysis.requestedLoan.monthlyEmi,
                )}
              />

              <InfoRow
                label="Safe EMI"
                value={formatCurrency(
                  analysis.affordability
                    .safeMonthlyEmi,
                )}
                highlight
              />

              <InfoRow
                label="Disposable income"
                value={formatCurrency(
                  analysis.affordability
                    .disposableIncome,
                )}
              />

              <InfoRow
                label="Existing EMI"
                value={formatCurrency(
                  analysis.affordability
                    .existingEmi,
                )}
              />
            </div>
          </div>
        </section>

        {/* =====================================
            GOLD LOAN
        ====================================== */}

        {isGoldLoan && analysis.goldLoan && (
          <section className="mt-5 overflow-hidden rounded-[26px] border border-[#B9914A]/20 bg-gradient-to-br from-[#18120B] via-[#110D09] to-[#0B0907] p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#B9914A]/20 bg-[#B9914A]/10 text-[#D9AE60]">
                  <Gem size={20} />
                </div>

                <div>
                  <SectionEyebrow>
                    Gold loan intelligence
                  </SectionEyebrow>

                  <h2 className="mt-2 text-xl font-semibold">
                    Value-backed borrowing snapshot
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9F9284]">
                    The assessed safe amount is constrained
                    by both monthly affordability and the
                    conservative value-based gold limit.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#B9914A]/20 bg-[#B9914A]/[0.06] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#9F9284]">
                  Final safe amount
                </p>

                <p className="fintech-number mt-1 text-2xl font-semibold text-[#E2BF7A]">
                  {formatCurrency(
                    analysis.goldLoan.finalSafeAmount,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MiniStat
                dark
                label="Estimated gold value"
                value={formatCurrency(
                  analysis.goldLoan
                    .estimatedGoldValue,
                )}
              />

              <MiniStat
                dark
                label="70% conservative limit"
                value={formatCurrency(
                  analysis.goldLoan
                    .maxLoanByGoldValue,
                )}
              />

              <MiniStat
                dark
                label="Limiting factor"
                value={analysis.goldLoan.limitingFactor.replace(
                  "_",
                  " ",
                )}
              />
            </div>
          </section>
        )}

        {/* =====================================
            PLAN COMPARISON
        ====================================== */}

        <section className="mt-5">
          <PlanComparison analysis={analysis} />
        </section>

        {/* =====================================
            STRESS + COST
        ====================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <StressTestCard analysis={analysis} />

          <BorrowingCostCard analysis={analysis} />
        </section>

        {/* =====================================
            DECISION + RECOMMENDATIONS
        ====================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <WhyCard analysis={analysis} />

          <RecommendationsCard
            recommendations={
              recommendations.recommendations
            }
          />
        </section>

        {/* =====================================
            NEGOTIATION CARD
        ====================================== */}

        <section className="mt-5">
          <NegotiationCard
            analysis={analysis}
            onStartAgain={onStartAgain}
          />
        </section>

        {/* =====================================
            SUMMARY
        ====================================== */}

        <section className="mt-5">
          <AssessmentSummary analysis={analysis} />
        </section>

        <footer className="py-8 text-center text-xs leading-5 text-[#5F5760]">
          Borrower Copilot is an educational financial
          self-assessment, not a loan approval or financial
          guarantee.
        </footer>
      </div>
    </main>
  );
}

/* =========================================
   SECTION EYEBROW
========================================= */

function SectionEyebrow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A66A96]">
      {children}
    </p>
  );
}

/* =========================================
   METRIC CARD
========================================= */

function MetricCard({
  icon,
  label,
  value,
  description,
  featured = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`fintech-card fintech-card-hover rounded-[22px] p-5 ${
        featured
          ? "border-[#8A4D7B]/30 bg-gradient-to-br from-[#19101A] to-[#100D12]"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#A66A96]">
          {icon}
        </span>

        {featured && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#39D39F] shadow-[0_0_12px_rgba(57,211,159,0.7)]" />
        )}
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#716873]">
        {label}
      </p>

      <p className="fintech-number mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#817783]">
        {description}
      </p>
    </div>
  );
}

/* =========================================
   MINI STAT
========================================= */

function MiniStat({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        dark
          ? "border-[#B9914A]/15 bg-white/[0.025]"
          : "border-white/[0.07] bg-white/[0.025]"
      }`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.12em] ${
          dark
            ? "text-[#9F9284]"
            : "text-[#716873]"
        }`}
      >
        {label}
      </p>

      <p
        className={`fintech-number mt-2 text-base font-semibold capitalize ${
          dark
            ? "text-[#D7C3A2]"
            : "text-[#E5DEE3]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================
   INFO ROW
========================================= */

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
      <span className="text-sm text-[#817783]">
        {label}
      </span>

      <span
        className={`fintech-number text-sm font-semibold ${
          highlight
            ? "text-[#D5A9CA]"
            : "text-[#E5DEE3]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================
   STRESS TEST
========================================= */

function StressTestCard({
  analysis,
}: {
  analysis: BorrowerAnalysisResult;
}) {
  return (
    <section className="fintech-card rounded-[26px] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionEyebrow>
            Income resilience
          </SectionEyebrow>

          <h2 className="mt-2 text-xl font-semibold">
            Stress test
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#817783]">
            How the proposed EMI behaves when income falls.
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] ${
            analysis.stressTest.worstCaseAffordable
              ? "border-[#39D39F]/20 bg-[#39D39F]/10 text-[#39D39F]"
              : "border-[#E66A78]/20 bg-[#E66A78]/10 text-[#E66A78]"
          }`}
        >
          {analysis.stressTest.worstCaseAffordable
            ? "RESILIENT"
            : "PRESSURE"}
        </span>
      </div>

      <div className="mt-7 space-y-5">
        {analysis.stressTest.scenarios.map(
          (scenario) => {
            const width = Math.min(
              scenario.emiToIncomeRatio,
              100,
            );

            return (
              <div
                key={
                  scenario.incomeDropPercentage
                }
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#E5DEE3]">
                      Income −
                      {
                        scenario.incomeDropPercentage
                      }
                      %
                    </p>

                    <p className="mt-0.5 text-xs text-[#716873]">
                      EMI ratio{" "}
                      {scenario.emiToIncomeRatio}%
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      scenario.isAffordable
                        ? "text-[#39D39F]"
                        : "text-[#E66A78]"
                    }`}
                  >
                    {scenario.isAffordable
                      ? "Within limit"
                      : "Above limit"}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full rounded-full ${
                      scenario.isAffordable
                        ? "bg-gradient-to-r from-[#4C9E82] to-[#39D39F]"
                        : "bg-gradient-to-r from-[#A34D5B] to-[#E66A78]"
                    }`}
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}

/* =========================================
   BORROWING COST
========================================= */

function BorrowingCostCard({
  analysis,
}: {
  analysis: BorrowerAnalysisResult;
}) {
  return (
    <section className="fintech-card rounded-[26px] p-6 sm:p-7">
      <SectionEyebrow>
        Cost intelligence
      </SectionEyebrow>

      <h2 className="mt-2 text-xl font-semibold">
        What the borrowing costs
      </h2>

      <div className="mt-7 space-y-5">
        <InfoRow
          label="Monthly EMI"
          value={formatCurrency(
            analysis.requestedLoan.monthlyEmi,
          )}
          highlight
        />

        <InfoRow
          label="Estimated APR"
          value={`${analysis.apr.estimatedApr}%`}
        />

        <InfoRow
          label="Processing fee"
          value={formatCurrency(
            analysis.apr.processingFee,
          )}
        />

        <InfoRow
          label="Total interest"
          value={formatCurrency(
            analysis.apr.totalInterest,
          )}
        />

        <InfoRow
          label="Net amount received"
          value={formatCurrency(
            analysis.apr.netDisbursedAmount,
          )}
          highlight
        />
      </div>
    </section>
  );
}

/* =========================================
   WHY RESULT
========================================= */

function WhyCard({
  analysis,
}: {
  analysis: BorrowerAnalysisResult;
}) {
  return (
    <section className="fintech-card rounded-[26px] p-6 sm:p-7">
      <SectionEyebrow>
        Decision signals
      </SectionEyebrow>

      <h2 className="mt-2 text-xl font-semibold">
        Why this result
      </h2>

      <div className="mt-6 space-y-4">
        {analysis.decision.reasons.map(
          (reason) => (
            <div
              key={reason}
              className="flex gap-3 rounded-2xl border border-[#39D39F]/10 bg-[#39D39F]/[0.035] p-4"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-[#39D39F]"
              />

              <p className="text-sm leading-6 text-[#A59AA4]">
                {reason}
              </p>
            </div>
          ),
        )}

        {analysis.decision.warnings.map(
          (warning) => (
            <div
              key={warning}
              className="flex gap-3 rounded-2xl border border-[#E7A84B]/10 bg-[#E7A84B]/[0.035] p-4"
            >
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-[#E7A84B]"
              />

              <p className="text-sm leading-6 text-[#A59AA4]">
                {warning}
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

/* =========================================
   RECOMMENDATIONS
========================================= */

function RecommendationsCard({
  recommendations,
}: {
  recommendations: BorrowerRecommendation[];
}) {
  return (
    <section className="fintech-card rounded-[26px] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionEyebrow>
            Next actions
          </SectionEyebrow>

          <h2 className="mt-2 text-xl font-semibold">
            What you can do next
          </h2>
        </div>

        <ChevronRight
          size={20}
          className="text-[#5F5760]"
        />
      </div>

      <div className="mt-6 space-y-3">
        {recommendations.map(
          (recommendation) => {
            const config = {
              high: {
                label: "HIGH",
                color: "#E66A78",
              },
              medium: {
                label: "MEDIUM",
                color: "#E7A84B",
              },
              low: {
                label: "TIP",
                color: "#A66A96",
              },
            }[recommendation.priority];

            return (
              <div
                key={recommendation.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        config.color,
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#E5DEE3]">
                        {recommendation.title}
                      </h3>

                      <span
                        className="text-[9px] font-bold tracking-[0.12em]"
                        style={{
                          color: config.color,
                        }}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#817783]">
                      {
                        recommendation.description
                      }
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}