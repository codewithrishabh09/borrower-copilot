import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
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
  const [profile, setProfile] = useState<BorrowerProfile>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(profile),
    [profile],
  );

  const currentQuestion = visibleQuestions[currentIndex];

  const currentValue = currentQuestion
    ? profile[currentQuestion.id as keyof BorrowerProfile]
    : undefined;

  const isCurrentQuestionValid = currentQuestion
    ? isQuestionValid(currentQuestion, profile)
    : false;

  function handleAnswer(value: string | number) {
    if (!currentQuestion) return;

    let formattedValue: string | number | boolean = value;

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
    if (!currentQuestion || !isCurrentQuestionValid) {
      return;
    }

    const isLastQuestion =
      currentIndex === visibleQuestions.length - 1;

    if (isLastQuestion) {
      onComplete(profile);
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex + 1);
  }

  function handleBack() {
    if (currentIndex === 0) {
      onExit();
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex - 1);
  }

  if (!currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F8] px-6">
        <p className="text-sm text-[#756A70]">
          Preparing your assessment...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F8] text-[#211A1E]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-6 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#E6E0E2] pb-6">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-3 text-left"
          >
            <Logo size={40} />

            <div>
              <p className="text-base font-semibold">
                Borrower Copilot
              </p>

              <p className="text-xs text-[#756A70]">
                Private self-assessment
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm text-[#756A70] sm:flex">
            <ShieldCheck size={17} />
            <span>No personal data stored</span>
          </div>
        </header>

        {/* Progress */}
        <div className="py-8">
          <ProgressBar
            current={currentIndex + 1}
            total={visibleQuestions.length}
          />
        </div>

        {/* Question Area */}
        <div className="flex flex-1 items-center py-6">
          <div className="w-full">
            <QuestionCard
              question={currentQuestion}
              value={currentValue}
              onChange={handleAnswer}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-[#E6E0E2] pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#756A70] transition hover:bg-[#F1ECEE]"
          >
            <ArrowLeft size={18} />

            {currentIndex === 0 ? "Exit" : "Back"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentQuestionValid}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition ${
              isCurrentQuestionValid
                ? "bg-[#4B2440] text-white shadow-sm hover:bg-[#3B1C32]"
                : "cursor-not-allowed bg-[#E6DFE2] text-[#A69BA0]"
            }`}
          >
            {currentIndex === visibleQuestions.length - 1
              ? "See my assessment"
              : "Continue"}

            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}