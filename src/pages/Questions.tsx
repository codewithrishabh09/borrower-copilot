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
      ? isQuestionValid(currentQuestion, profile)
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

    if (currentQuestion.type === "yes_no") {
      formattedValue = value === "true";
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

  if (!currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08070A] px-6">
        <p className="text-sm text-[#A59AA4]">
          Preparing your assessment...
        </p>
      </main>
    );
  }

  const progress =
    ((currentIndex + 1) /
      visibleQuestions.length) *
    100;

  return (
    <main className="fintech-shell min-h-screen bg-[#08070A] text-[#F5F1F4]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-3 text-left"
          >
            <Logo size={40} />

            <div>
              <p className="text-sm font-semibold">
                Borrower Copilot
              </p>

              <p className="text-[10px] uppercase tracking-[0.12em] text-[#716873]">
                Financial intelligence
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-xs text-[#716873] sm:flex">
            <ShieldCheck
              size={16}
              className="text-[#A66A96]"
            />

            <span>
              Your assessment stays on this device
            </span>
          </div>
        </header>

        <div className="py-7">
          <ProgressBar
            current={currentIndex + 1}
            total={visibleQuestions.length}
          />
        </div>

        <div className="flex flex-1 items-center py-8">
          <div className="w-full">
            <div className="mb-7 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5F5760]">
                Profile signal
              </span>

              <span className="text-[10px] text-[#5F5760]">
                {Math.round(progress)}% complete
              </span>
            </div>

            <div className="fintech-card fintech-card-hover rounded-[28px] p-6 sm:p-9 lg:p-11">
              <QuestionCard
                question={currentQuestion}
                value={currentValue}
                onChange={handleAnswer}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#817783] transition hover:bg-white/[0.05] hover:text-[#D0C8CE]"
          >
            <ArrowLeft size={17} />

            {currentIndex === 0
              ? "Exit"
              : "Back"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentQuestionValid}
            className={`group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition ${
              isCurrentQuestionValid
                ? "bg-gradient-to-r from-[#6D3B63] to-[#8A4D7B] text-white shadow-[0_12px_35px_rgba(109,59,99,0.25)] hover:-translate-y-0.5"
                : "cursor-not-allowed bg-white/[0.06] text-[#5B555C]"
            }`}
          >
            {currentIndex ===
            visibleQuestions.length - 1
              ? "See my assessment"
              : "Continue"}

            <ArrowRight
              size={17}
              className={
                isCurrentQuestionValid
                  ? "transition-transform group-hover:translate-x-1"
                  : ""
              }
            />
          </button>
        </div>
      </div>
    </main>
  );
}