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
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#8A4D7B] via-[#6D3B63] to-[#32172B] text-white shadow-[0_8px_30px_rgba(109,59,99,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-label="Borrower Copilot"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_45%)]" />

      <span
        className="relative font-bold leading-none"
        style={{
          fontSize: size * 0.58,
        }}
      >
        ₹
      </span>
    </div>
  );
}