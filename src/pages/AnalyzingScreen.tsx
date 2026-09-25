import {
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import Logo from "../components/Logo";

interface AnalyzingScreenProps {
  onComplete: () => void;
}

const analysisSteps = [
  {
    label: "Processing your financial information",
    description:
      "Structuring your borrower profile",
    icon: BrainCircuit,
  },
  {
    label: "Calculating borrowing affordability",
    description:
      "Estimating your safe EMI and borrowing capacity",
    icon: CircleDollarSign,
  },
  {
    label: "Running income stress tests",
    description:
      "Checking repayment pressure and resilience",
    icon: TrendingUp,
  },
  {
    label: "Generating personalized recommendations",
    description:
      "Building your final borrowing position",
    icon: ShieldCheck,
  },
];

export default function AnalyzingScreen({
  onComplete,
}: AnalyzingScreenProps) {
  const [currentStep, setCurrentStep] =
    useState(0);

  useEffect(() => {
    if (
      currentStep >=
      analysisSteps.length
    ) {
      const completeTimer =
        window.setTimeout(
          onComplete,
          500,
        );

      return () =>
        window.clearTimeout(
          completeTimer,
        );
    }

    const timer =
      window.setTimeout(() => {
        setCurrentStep(
          (previousStep) =>
            previousStep + 1,
        );
      }, 900);

    return () =>
      window.clearTimeout(timer);
  }, [currentStep, onComplete]);

  const progress = Math.min(
    Math.round(
      (currentStep /
        analysisSteps.length) *
        100,
    ),
    100,
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070A] px-5 py-10 text-[#F5F1F4] sm:px-8">
      {/* =========================================
          AMBIENT BACKGROUND
      ========================================== */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D3B63]/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-48 -top-48 h-[420px] w-[420px] rounded-full bg-[#8A4D7B]/10 blur-[120px]" />

      {/* =========================================
          MAIN CONTENT
      ========================================== */}

      <section className="relative w-full max-w-2xl">
        {/* =========================================
            BRAND
        ========================================== */}

        <div className="mb-8 flex items-center justify-center gap-3">
          <Logo size={44} />

          <div>
            <p className="text-sm font-semibold tracking-tight">
              Borrower Copilot
            </p>

            <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#716873]">
              Financial intelligence
            </p>
          </div>
        </div>

        {/* =========================================
            MAIN CARD
        ========================================== */}

        <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#151016] via-[#0F0C11] to-[#0A090C] p-6 shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:p-9">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Animated loader */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#A66A96]/20 bg-[#6D3B63]/10 text-[#C99DBE]">
              <LoaderCircle
                size={23}
                className="animate-spin"
              />

              <span className="absolute inset-0 rounded-2xl bg-[#A66A96]/5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A66A96]">
                  Analyzing
                </p>

                <Sparkles
                  size={13}
                  className="text-[#D5A9CA]"
                />
              </div>

              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#F5F1F4] sm:text-3xl">
                Building your borrowing assessment
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#817783]">
            We are evaluating affordability, borrowing
            costs, repayment pressure, and financial
            resilience based on the information you
            provided.
          </p>

          {/* =========================================
              PROGRESS
          ========================================== */}

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#716873]">
                Analysis progress
              </span>

              <span className="fintech-number text-xs font-semibold text-[#C99DBE]">
                {progress}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6D3B63] via-[#8A4D7B] to-[#B77BA8] transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* =========================================
              ANALYSIS STEPS
          ========================================== */}

          <div className="mt-8 space-y-3">
            {analysisSteps.map(
              (step, index) => {
                const StepIcon =
                  step.icon;

                const isCompleted =
                  index < currentStep;

                const isCurrent =
                  index === currentStep;

                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                      isCurrent
                        ? "border-[#A66A96]/20 bg-[#6D3B63]/[0.08]"
                        : isCompleted
                          ? "border-[#39D39F]/10 bg-[#39D39F]/[0.025]"
                          : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCompleted
                          ? "bg-[#39D39F]/10 text-[#39D39F]"
                          : isCurrent
                            ? "bg-[#6D3B63]/20 text-[#D5A9CA]"
                            : "bg-white/[0.04] text-[#5F5760]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2
                          size={18}
                        />
                      ) : (
                        <StepIcon
                          size={18}
                          className={
                            isCurrent
                              ? "animate-pulse"
                              : ""
                          }
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          isCompleted
                            ? "text-[#B8DCCF]"
                            : isCurrent
                              ? "text-[#E5DEE3]"
                              : "text-[#5F5760]"
                        }`}
                      >
                        {step.label}
                      </p>

                      <p
                        className={`mt-1 text-xs leading-5 ${
                          isCurrent
                            ? "text-[#817783]"
                            : isCompleted
                              ? "text-[#5F776D]"
                              : "text-[#514A51]"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Status */}
                    {isCurrent && (
                      <span className="hidden shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-[#A66A96] sm:block">
                        Running
                      </span>
                    )}

                    {isCompleted && (
                      <span className="hidden shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-[#39D39F] sm:block">
                        Done
                      </span>
                    )}
                  </div>
                );
              },
            )}
          </div>

          {/* =========================================
              PRIVACY / TRUST FOOTER
          ========================================== */}

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-6 text-center text-[10px] leading-5 text-[#5F5760]">
            <ShieldCheck
              size={13}
              className="shrink-0 text-[#39D39F]"
            />

            <span>
              This assessment is generated from the
              financial information provided during
              this session.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}