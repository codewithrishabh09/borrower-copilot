import {
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AnalyzingScreenProps {
  onComplete: () => void;
}

const analysisSteps = [
  {
    label: "Processing your financial information",
    icon: BrainCircuit,
  },
  {
    label: "Calculating borrowing affordability",
    icon: TrendingUp,
  },
  {
    label: "Running income stress tests",
    icon: ShieldCheck,
  },
  {
    label: "Generating personalized recommendations",
    icon: CheckCircle2,
  },
];

export default function AnalyzingScreen({
  onComplete,
}: AnalyzingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= analysisSteps.length) {
      const completeTimer = window.setTimeout(
        onComplete,
        500,
      );

      return () => window.clearTimeout(completeTimer);
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((previousStep) => previousStep + 1);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F8] px-6 py-10 text-[#211A1E]">
      <section className="w-full max-w-xl">
        {/* Brand */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4B2440] font-bold text-white">
            BC
          </div>

          <div>
            <h1 className="font-semibold">
              Borrower Copilot
            </h1>

            <p className="text-xs text-[#756A70]">
              Preparing your assessment
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-[#E6DFE2] bg-white p-7 shadow-sm sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EEF1] text-[#643652]">
              <LoaderCircle
                size={24}
                className="animate-spin"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#643652]">
                ANALYZING
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Building your borrowing assessment
              </h2>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-[#756A70]">
            We are evaluating affordability, borrowing
            costs, and potential financial pressure based
            on the information you provided.
          </p>

          {/* Progress */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-xs text-[#756A70]">
              <span>Analysis progress</span>

              <span>
                {Math.min(
                  Math.round(
                    (currentStep /
                      analysisSteps.length) *
                      100,
                  ),
                  100,
                )}
                %
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#EEE8EB]">
              <div
                className="h-full rounded-full bg-[#4B2440] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (currentStep /
                      analysisSteps.length) *
                      100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 space-y-4">
            {analysisSteps.map((step, index) => {
              const StepIcon = step.icon;

              const isCompleted =
                index < currentStep;

              const isCurrent =
                index === currentStep;

              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                    isCurrent
                      ? "border-[#D8C8D0] bg-[#FAF6F8]"
                      : "border-[#EAE4E6] bg-white"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-600"
                        : isCurrent
                          ? "bg-[#4B2440] text-white"
                          : "bg-[#F3EEF1] text-[#9A8C92]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} />
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

                  <p
                    className={`text-sm ${
                      isCompleted
                        ? "font-medium text-[#40383C]"
                        : isCurrent
                          ? "font-semibold text-[#211A1E]"
                          : "text-[#9A8C92]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-[#84777E]">
            This assessment is generated from the financial
            information provided during this session.
          </p>
        </div>
      </section>
    </main>
  );
}