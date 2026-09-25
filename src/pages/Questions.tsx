import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import Logo from "../components/Logo";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";

import {
  getVisibleQuestions,
  isQuestionValid,
  updateBorrowerAnswer,
} from "../engine/questionFlow";

import type { BorrowerProfile } from "../types/borrower";

interface QuestionsProps {
  onComplete: (profile: BorrowerProfile) => void;
  onExit: () => void;
}

export default function Questions({
  onComplete,
  onExit,
}: QuestionsProps) {
  const [profile, setProfile] =
    useState<BorrowerProfile>({});

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(profile),
    [profile],
  );

  const currentQuestion =
    visibleQuestions[currentIndex];

  const currentValue = currentQuestion
    ? profile[
        currentQuestion.id as keyof BorrowerProfile
      ]
    : undefined;

  const isCurrentQuestionValid =
    currentQuestion
      ? isQuestionValid(
          currentQuestion,
          profile,
        )
      : false;

  function handleAnswer(
    value: string | number,
  ) {
    if (!currentQuestion) {
      return;
    }

    let formattedValue:
      | string
      | number
      | boolean = value;

    if (
      currentQuestion.type === "yes_no"
    ) {
      formattedValue =
        value === "true";
    }

    setProfile((previousProfile) =>
      updateBorrowerAnswer(
        previousProfile,
        currentQuestion.id,
        formattedValue,
      ),
    );
  }

  function handleNext() {
    if (
      !currentQuestion ||
      !isCurrentQuestionValid
    ) {
      return;
    }

    const isLastQuestion =
      currentIndex ===
      visibleQuestions.length - 1;

    if (isLastQuestion) {
      onComplete(profile);
      return;
    }

    setCurrentIndex(
      (previousIndex) =>
        previousIndex + 1,
    );
  }

  function handleBack() {
    if (currentIndex === 0) {
      onExit();
      return;
    }

    setCurrentIndex(
      (previousIndex) =>
        previousIndex - 1,
    );
  }

  /*
   * Fallback state.
   * This does not change the existing
   * question flow logic.
   */
  if (!currentQuestion) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070A] px-6 text-[#F5F1F4]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D3B63]/10 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto mb-5">
            <Logo size={48} />
          </div>

          <div className="mx-auto mb-4 h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.07]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#8A4D7B]" />
          </div>

          <p className="text-sm font-medium text-[#817783]">
            Preparing your assessment...
          </p>
        </div>
      </main>
    );
  }

  const progress = Math.min(
    ((currentIndex + 1) /
      Math.max(
        visibleQuestions.length,
        1,
      )) *
      100,
    100,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#08070A] text-[#F5F1F4]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed -right-48 -top-48 h-[520px] w-[520px] rounded-full bg-[#6D3B63]/10 blur-[130px]" />

      <div className="pointer-events-none fixed -bottom-52 -left-48 h-[520px] w-[520px] rounded-full bg-[#4B2440]/10 blur-[130px]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-5 sm:px-8">
        {/* =========================================
            HEADER
        ========================================== */}

        <header className="rounded-2xl border border-white/[0.08] bg-[#0D0A0F]/80 px-4 py-3 backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onExit}
              className="group flex items-center gap-3 text-left"
            >
              <Logo size={40} />

              <div>
                <p className="text-sm font-semibold tracking-tight text-[#F5F1F4]">
                  Borrower Copilot
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#716873]">
                  Financial assessment
                </p>
              </div>
            </button>

            {/* Privacy badge */}
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#716873] sm:flex">
              <ShieldCheck
                size={14}
                className="text-[#39D39F]"
              />

              Private session
            </div>
          </div>
        </header>

        {/* =========================================
            PROGRESS
        ========================================== */}

        <div className="py-7 sm:py-8">
          <ProgressBar
            current={currentIndex + 1}
            total={visibleQuestions.length}
          />
        </div>

        {/* =========================================
            QUESTION AREA
        ========================================== */}

        <section className="flex flex-1 items-center py-6 sm:py-10">
          <div className="w-full">
            <div className="mx-auto max-w-3xl">
              <QuestionCard
                question={currentQuestion}
                value={currentValue}
                onChange={handleAnswer}
              />
            </div>
          </div>
        </section>

        {/* =========================================
            BOTTOM NAVIGATION
        ========================================== */}

        <div className="border-t border-white/[0.07] pt-5">
          <div className="flex items-center justify-between gap-4">
            {/* Back / Exit */}
            <button
              type="button"
              onClick={handleBack}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-[#817783] transition duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#E5DEE3]"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span>
                {currentIndex === 0
                  ? "Exit"
                  : "Back"}
              </span>
            </button>

            {/* Desktop progress indicator */}
            <div className="hidden text-right sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#514A51]">
                Assessment
              </p>

              <p className="mt-1 text-xs font-semibold text-[#817783]">
                {Math.round(progress)}%
                <span className="ml-1 font-normal text-[#514A51]">
                  complete
                </span>
              </p>
            </div>

            {/* Continue */}
            <button
              type="button"
              onClick={handleNext}
              disabled={
                !isCurrentQuestionValid
              }
              className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition duration-200 sm:px-6 ${
                isCurrentQuestionValid
                  ? "bg-gradient-to-r from-[#6D3B63] to-[#8A4D7B] text-white shadow-[0_12px_35px_rgba(109,59,99,0.22)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(109,59,99,0.3)]"
                  : "cursor-not-allowed bg-white/[0.06] text-[#514A51]"
              }`}
            >
              <span>
                {currentIndex ===
                visibleQuestions.length - 1
                  ? "See my assessment"
                  : "Continue"}
              </span>

              <ArrowRight
                size={17}
                className={
                  isCurrentQuestionValid
                    ? "transition-transform duration-200 group-hover:translate-x-0.5"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {/* Bottom safe-space */}
        <div className="h-2" />
      </div>
    </main>
  );
}