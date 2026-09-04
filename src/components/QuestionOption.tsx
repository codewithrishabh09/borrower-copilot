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
          ? "border-[#4B2440] bg-[#F4EDF1] shadow-[0_8px_25px_rgba(75,36,64,0.08)]"
          : "border-[#E6DFE2] bg-white hover:border-[#B99CAC] hover:bg-[#FCFAFB]"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Selection indicator */}
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
            selected
              ? "border-[#4B2440] bg-[#4B2440]"
              : "border-[#CFC5C9] bg-white group-hover:border-[#8A647C]"
          }`}
        >
          {selected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <p
            className={`font-semibold ${
              selected ? "text-[#4B2440]" : "text-[#211A1E]"
            }`}
          >
            {option.label}
          </p>

          {option.description && (
            <p className="mt-1 text-sm leading-6 text-[#756A70]">
              {option.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}