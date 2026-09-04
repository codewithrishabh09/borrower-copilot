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
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center rounded-full bg-[#F4EDF1] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#643652]">
          Borrower assessment
        </div>

        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#211A1E] sm:text-4xl">
          {question.title}
        </h1>

        {question.description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#756A70]">
            {question.description}
          </p>
        )}
      </div>

      {/* Selection Questions */}
      {isSelectionQuestion && question.options && (
        <div className="grid gap-3">
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
        <div className="max-w-xl">
          <div className="relative">
            {question.prefix && (
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#756A70]">
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
              className={`w-full rounded-2xl border bg-white px-5 py-5 text-xl font-medium text-[#211A1E] outline-none transition placeholder:text-[#B0A5AA] focus:border-[#4B2440] focus:ring-4 focus:ring-[#4B2440]/10 ${
                question.prefix ? "pl-10" : ""
              } ${question.suffix ? "pr-24" : ""}`}
            />

            {question.suffix && (
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#756A70]">
                {question.suffix}
              </span>
            )}
          </div>

          {question.prefix === "₹" && (
            <p className="mt-3 text-sm text-[#84777E]">
              Enter the amount in Indian rupees.
            </p>
          )}
        </div>
      )}
    </section>
  );
}