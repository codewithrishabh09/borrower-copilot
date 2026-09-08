interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({
  size = 40,
  className = "",
}: LogoProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-[#4B2440] text-white shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-label="Borrower Copilot"
    >
      <span
        className="font-bold leading-none"
        style={{
          fontSize: size * 0.6,
        }}
      >
        ₹
      </span>
    </div>
  );
}