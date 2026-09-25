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
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-[#A66A96]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A66A96]">
            Borrower intelligence
          </span>
        </div>

        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#F5F1F4] sm:text-4xl lg:text-5xl">
          {question.title}
        </h1>

        {question.description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#A59AA4]">
            {question.description}
          </p>
        )}
      </div>

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

      {question.type === "number" && (
        <div className="max-w-xl">
          <div className="relative">
            {question.prefix && (
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl font-semibold text-[#A59AA4]">
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
              className={`w-full rounded-2xl border border-white/10 bg-[#100D12] px-5 py-5 text-2xl font-semibold text-[#F5F1F4] outline-none transition placeholder:text-[#5F5760] focus:border-[#A66A96]/60 focus:bg-[#17121A] focus:ring-4 focus:ring-[#6D3B63]/15 ${
                question.prefix ? "pl-11" : ""
              } ${question.suffix ? "pr-24" : ""}`}
            />

            {question.suffix && (
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#A59AA4]">
                {question.suffix}
              </span>
            )}
          </div>

          {question.prefix === "₹" && (
            <p className="mt-3 text-xs text-[#716873]">
              Enter the amount in Indian rupees.
            </p>
          )}
        </div>
      )}
    </section>
  );
}