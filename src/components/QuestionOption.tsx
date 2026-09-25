import type { QuestionOption as QuestionOptionType } from "../questions/mustQuestions";

interface QuestionOptionProps {
  option: QuestionOptionType;
  selected: boolean;
  onSelect: (value: string) => void;
}

export default function QuestionOption({
  option,
  selected,
  onSelect,
}: QuestionOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-[#A66A96]/60 bg-[#6D3B63]/20 shadow-[0_12px_40px_rgba(109,59,99,0.18)]"
          : "border-white/[0.08] bg-[#100D12] hover:-translate-y-0.5 hover:border-[#A66A96]/35 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
            selected
              ? "border-[#A66A96] bg-[#6D3B63]"
              : "border-white/15 bg-[#100D12] group-hover:border-[#A66A96]"
          }`}
        >
          {selected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>

        <div className="min-w-0">
          <p
            className={`font-semibold ${
              selected
                ? "text-[#F5F1F4]"
                : "text-[#F5F1F4]"
            }`}
          >
            {option.label}
          </p>

          {option.description && (
            <p className="mt-1 text-sm leading-6 text-[#A59AA4]">
              {option.description}
            </p>
          )}
        </div>

        {selected && (
          <span className="ml-auto shrink-0 text-xs font-semibold text-[#D5A9CA]">
            Selected
          </span>
        )}
      </div>
    </button>
  );
}