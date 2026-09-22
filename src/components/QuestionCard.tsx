import type { Question } from "../questions/mustQuestions";
import QuestionOption from "./QuestionOption";

interface QuestionCardProps {
  question: Question;
  value: string | number | boolean | undefined;
  onChange: (value: string | number) => void;
}

export default function QuestionCard({
  question,
  value,
  onChange,
}: QuestionCardProps) {
  const selectedValue = String(value ?? "");

  const isSelectionQuestion =
    question.type === "single_select" ||
    question.type === "yes_no";

  return (
    <section className="w-full">
      {/* Question number area */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full bg-[#F4EDF1] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#643652]">
          Borrower assessment
        </div>

        <h1 className="max-w-3xl text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug sm:leading-tight tracking-[-0.03em] text-[#211A1E]">
          {question.title}
        </h1>

        {question.description && (
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-[#756A70]">
            {question.description}
          </p>
        )}
      </div>

      {/* Selection Questions */}
      {isSelectionQuestion && question.options && (
        <div className="grid gap-3 sm:gap-4">
          {question.options.map((option) => (
            <QuestionOption
              key={option.value}
              option={option}
              selected={selectedValue === option.value}
              onSelect={onChange}
            />
          ))}
        </div>
      )}

      {/* Number Input */}
      {question.type === "number" && (
        <div className="w-full max-w-2xl">
          <div className="relative">
            {question.prefix && (
              <span className="pointer-events-none absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-base sm:text-lg font-semibold text-[#756A70]">
                {question.prefix}
              </span>
            )}

            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={selectedValue}
              placeholder={question.placeholder}
              onChange={(event) => {
                const inputValue = event.target.value;

                onChange(
                  inputValue === ""
                    ? ""
                    : Number(inputValue),
                );
              }}
              className={`w-full rounded-2xl border bg-white px-4 sm:px-5 py-4 sm:py-5 text-lg sm:text-xl font-medium text-[#211A1E] outline-none transition placeholder:text-[#B0A5AA] focus:border-[#4B2440] focus:ring-4 focus:ring-[#4B2440]/10 ${
                question.prefix ? "pl-9 sm:pl-10" : ""
              } ${question.suffix ? "pr-20 sm:pr-24" : ""}`}
            />

            {question.suffix && (
              <span className="pointer-events-none absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-[#756A70]">
                {question.suffix}
              </span>
            )}
          </div>

          {question.prefix === "₹" && (
            <p className="mt-3 text-xs sm:text-sm text-[#84777E]">
              Enter the amount in Indian rupees.
            </p>
          )}
        </div>
      )}
    </section>
  );
}