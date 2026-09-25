interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const safeTotal = Math.max(total, 1);

  const progress = Math.min(
    Math.max((current / safeTotal) * 100, 0),
    100,
  );

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#716873]">
            Financial assessment
          </p>

          <p className="mt-1 text-sm font-medium text-[#A59AA4]">
            Building your borrower profile
          </p>
        </div>

        <p className="fintech-number text-sm font-semibold text-[#D5A9CA]">
          {String(current).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </p>
      </div>

      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        role="progressbar"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-[#54294D] via-[#8A4D7B] to-[#B77BA8] transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
          }}
        >
          <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]" />
        </div>
      </div>
    </div>
  );
}