import type { Question } from "../questions/mustQuestions";

interface QuestionOptionProps {
  option: Question["options"][number];
  selected: boolean;
  onSelect: (value: string | number) => void;
}

export default function QuestionOption({
  option,
  selected,
  onSelect,
}: QuestionOptionProps) {
  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`rounded-xl border border-[#E6DFE2] bg-white p-4 sm:p-5 min-h-[48px] flex items-center gap-3 text-left transition ${
        selected
          ? "border-[#4B2440] bg-[#F4EDF1]"
          : "hover:bg-[#F5F2F4]"
      }`}
    >
      {/* Radio/Checkbox circle */}
      <div
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
          selected
            ? "border-[#4B2440] bg-[#4B2440]"
            : "border-[#D0C5CB] bg-white"
        }`}
      >
        {selected && (
          <svg
            className="h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#211A1E]">
          {option.label}
        </h3>
        {option.description && (
          <p className="mt-1 text-xs sm:text-sm leading-5 text-[#756A70]">
            {option.description}
          </p>
        )}
      </div>
    </button>
  );
}