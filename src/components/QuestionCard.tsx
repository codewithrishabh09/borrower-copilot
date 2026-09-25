import type { Question } from "../questions/mustQuestions";
import QuestionOption from "./QuestionOption";

interface QuestionCardProps {
  question: Question;
  value:
    | string
    | number
    | boolean
    | undefined;
  onChange: (
    value: string | number,
  ) => void;
}

export default function QuestionCard({
  question,
  value,
  onChange,
}: QuestionCardProps) {
  const selectedValue = String(
    value ?? "",
  );

  const isSelectionQuestion =
    question.type === "single_select" ||
    question.type === "yes_no";

  return (
    <section className="w-full">
      {/* Question label */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A66A96]/20 bg-[#6D3B63]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#C99DBE]">
            Borrower assessment
          </span>

          <span className="h-px w-8 bg-white/[0.08]" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5F5760]">
            Financial profile
          </span>
        </div>

        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#F5F1F4] sm:text-4xl lg:text-5xl">
          {question.title}
        </h1>

        {question.description && (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#817783] sm:text-base">
            {question.description}
          </p>
        )}
      </div>

      {/* Selection questions */}
      {isSelectionQuestion &&
        question.options && (
          <div className="grid gap-3">
            {question.options.map(
              (option) => (
                <QuestionOption
                  key={option.value}
                  option={option}
                  selected={
                    selectedValue ===
                    option.value
                  }
                  onSelect={onChange}
                />
              ),
            )}
          </div>
        )}

      {/* Number input */}
      {question.type === "number" && (
        <div className="max-w-2xl">
          <div className="relative">
            {question.prefix && (
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl font-semibold text-[#817783]">
                {question.prefix}
              </span>
            )}

            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={selectedValue}
              placeholder={
                question.placeholder
              }
              onChange={(event) => {
                const inputValue =
                  event.target.value;

                onChange(
                  inputValue === ""
                    ? ""
                    : Number(inputValue),
                );
              }}
              className={`w-full rounded-2xl border border-white/[0.08] bg-[#100D12] px-5 py-5 text-xl font-medium text-[#F5F1F4] outline-none transition duration-200 placeholder:text-[#514A51] focus:border-[#A66A96]/40 focus:bg-[#120E14] focus:ring-4 focus:ring-[#6D3B63]/10 ${
                question.prefix
                  ? "pl-10"
                  : ""
              } ${
                question.suffix
                  ? "pr-24"
                  : ""
              }`}
            />

            {question.suffix && (
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-[#716873]">
                {question.suffix}
              </span>
            )}
          </div>

          {question.prefix === "₹" && (
            <p className="mt-3 text-[11px] text-[#5F5760]">
              Enter the amount in Indian rupees.
            </p>
          )}
        </div>
      )}
    </section>
  );
}