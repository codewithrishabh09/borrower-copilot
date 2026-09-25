interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const safeTotal =
    Math.max(total, 1);

  const progress = Math.min(
    Math.max(
      (current / safeTotal) * 100,
      0,
    ),
    100,
  );

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#716873]">
            Assessment progress
          </p>

          <p className="mt-1 text-xs text-[#514A51]">
            Your answers stay in this session.
          </p>
        </div>

        <p className="fintech-number text-xs font-semibold text-[#C99DBE]">
          {current}{" "}
          <span className="text-[#5F5760]">
            / {total}
          </span>
        </p>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6D3B63] via-[#8A4D7B] to-[#B77BA8] transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}