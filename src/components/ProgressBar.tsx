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
        <p className="text-sm font-medium text-[#756A70]">
          Assessment progress
        </p>

        <p className="text-sm font-semibold text-[#4B2440]">
          {current} of {total}
        </p>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[#ECE6E9]"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-[#4B2440] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}