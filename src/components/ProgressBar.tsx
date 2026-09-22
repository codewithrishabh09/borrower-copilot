interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-medium text-[#756A70]">
          Question {current} of {total}
        </p>

        <span className="text-xs sm:text-sm font-semibold text-[#756A70]">
          {percentage}%
        </span>
      </div>

      <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-[#E6DFE2]">
        <div
          className="h-full bg-gradient-to-r from-[#4B2440] to-[#643652] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}