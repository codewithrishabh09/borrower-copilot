import { ArrowRight, ShieldCheck, Scale, WalletCards } from "lucide-react";

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <main className="min-h-screen bg-[#FAF9F8] text-[#211A1E]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 md:px-10 lg:px-16">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#E6E0E2] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B2440] text-sm font-bold text-white shadow-sm">
              BC
            </div>

            <div>
              <h1 className="text-base font-semibold tracking-tight">
                Borrower Copilot
              </h1>
              <p className="text-xs text-[#756A70]">
                Know your position before you borrow.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-[#756A70] sm:flex">
            <ShieldCheck size={17} />
            <span>Private self-assessment</span>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 items-center py-16 lg:py-24">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left */}
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E4D9DF] bg-[#F4EDF1] px-4 py-2 text-sm font-medium text-[#643652]">
                <span className="h-2 w-2 rounded-full bg-[#643652]" />
                Indian borrower self-assessment
              </div>

              <h2 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Borrow with{" "}
                <span className="text-[#643652]">clarity</span>, not pressure.
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6F646A] sm:text-xl">
                Understand whether you should borrow, how much you can safely
                carry, what a fair interest rate looks like, and the EMI you
                should not cross.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={onStart}
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#4B2440] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B1C32]"
                >
                  Start your assessment

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

                <p className="text-sm text-[#81757B]">
                  Takes approximately 5 minutes
                </p>
              </div>

              {/* Trust points */}
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <Feature
                  icon={<Scale size={19} />}
                  title="Independent view"
                  description="Not designed to sell you a loan."
                />

                <Feature
                  icon={<WalletCards size={19} />}
                  title="Your safe limit"
                  description="Separate from what a lender may offer."
                />

                <Feature
                  icon={<ShieldCheck size={19} />}
                  title="No account needed"
                  description="Your assessment stays on this device."
                />
              </div>
            </div>

            {/* Right Card */}
            <div className="relative">
              <div className="rounded-[2rem] border border-[#E6DFE2] bg-white p-6 shadow-[0_24px_70px_rgba(56,35,48,0.08)] sm:p-8">
                <div className="flex items-center justify-between border-b border-[#EEE9EB] pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A7C83]">
                      Your outcome
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                      Before you speak to a lender
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2E8EE] font-semibold text-[#643652]">
                    4
                  </div>
                </div>

                <div className="space-y-5 pt-6">
                  <Outcome
                    number="01"
                    title="Borrow decision"
                    description="Borrow, borrow less, or wait."
                  />

                  <Outcome
                    number="02"
                    title="Safe borrowing limit"
                    description="Your safe amount vs likely sanction."
                  />

                  <Outcome
                    number="03"
                    title="Fair rate range"
                    description="Including the all-in borrowing cost."
                  />

                  <Outcome
                    number="04"
                    title="EMI ceiling"
                    description="With a stress-tested scenario."
                  />
                </div>

                <div className="mt-7 rounded-2xl bg-[#4B2440] p-5 text-white">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#D8BECF]">
                    Final output
                  </p>

                  <p className="mt-2 text-lg font-medium">
                    A Negotiation Card you can take to a lender.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E6E0E2] pt-5 text-sm text-[#84777E]">
          Borrower Copilot · A transparent financial self-assessment
        </footer>
      </div>
    </main>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="rounded-2xl border border-[#E8E2E5] bg-white p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2E8EE] text-[#643652]">
        {icon}
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-[#756A70]">
        {description}
      </p>
    </div>
  );
}

interface OutcomeProps {
  number: string;
  title: string;
  description: string;
}

function Outcome({ number, title, description }: OutcomeProps) {
  return (
    <div className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E6DDE2] bg-[#FAF7F8] text-xs font-bold text-[#643652]">
        {number}
      </span>

      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-[#756A70]">
          {description}
        </p>
      </div>
    </div>
  );
}