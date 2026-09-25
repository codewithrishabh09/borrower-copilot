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
      className={`flex shrink-0 items-center justify-center rounded-xl border border-[#A66A96]/25 bg-[#6D3B63]/15 text-[#D5A9CA] shadow-[0_8px_24px_rgba(109,59,99,0.15)] ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-label="Borrower Copilot"
    >
      <span
        className="font-bold leading-none"
        style={{
          fontSize: size * 0.58,
        }}
      >
        ₹
      </span>
    </div>
  );
}