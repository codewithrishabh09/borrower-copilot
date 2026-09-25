import { Check } from "lucide-react";

import type { QuestionOption as QuestionOptionType } from "../questions/mustQuestions";

interface QuestionOptionProps {
  option: QuestionOptionType;
  selected: boolean;
  onSelect: (
    value: string,
  ) => void;
}

export default function QuestionOption({
  option,
  selected,
  onSelect,
}: QuestionOptionProps) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelect(option.value)
      }
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-[#A66A96]/35 bg-gradient-to-r from-[#6D3B63]/15 to-[#6D3B63]/[0.04] shadow-[0_15px_40px_rgba(109,59,99,0.12)]"
          : "border-white/[0.07] bg-white/[0.025] hover:border-[#A66A96]/20 hover:bg-white/[0.045]"
      }`}
    >
      {/* Selection glow */}
      {selected && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#A66A96] to-[#6D3B63]" />
      )}

      <div className="flex items-start gap-4">
        {/* Selection indicator */}
        <div
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
            selected
              ? "border-[#A66A96] bg-[#6D3B63] text-white"
              : "border-white/[0.14] bg-white/[0.025] text-transparent group-hover:border-[#8A4D7B]/50"
          }`}
        >
          {selected && (
            <Check size={13} strokeWidth={3} />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold sm:text-base ${
              selected
                ? "text-[#F0DCEB]"
                : "text-[#E5DEE3]"
            }`}
          >
            {option.label}
          </p>

          {option.description && (
            <p className="mt-1.5 text-sm leading-6 text-[#716873]">
              {option.description}
            </p>
          )}
        </div>

        {/* Right indicator */}
        <span
          className={`mt-1 hidden text-[9px] font-bold uppercase tracking-[0.12em] sm:block ${
            selected
              ? "text-[#A66A96]"
              : "text-[#403A40]"
          }`}
        >
          {selected
            ? "Selected"
            : "Choose"}
        </span>
      </div>
    </button>
  );
}