import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  FileText,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import type { ReactNode } from "react";

import Logo from "../components/Logo";

interface HomeProps {
  onStart: () => void;
}

export default function Home({
  onStart,
}: HomeProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08070A] text-[#F5F1F4]">
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#6D3B63]/20 blur-[140px]" />

      <div className="pointer-events-none fixed -bottom-60 -left-40 h-[520px] w-[520px] rounded-full bg-[#4B2440]/15 blur-[140px]" />

      <div className="pointer-events-none fixed left-[55%] top-[45%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A33E91]/[0.045] blur-[120px]" />

      {/* =====================================================
          MAIN WRAPPER
      ====================================================== */}

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 py-5 sm:px-8 lg:px-10">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="relative z-40 flex items-center justify-between rounded-2xl border border-white/[0.075] bg-[#0C090E]/80 px-4 py-3 backdrop-blur-xl sm:px-5">
          {/* Brand */}

          <div className="flex items-center gap-3">
            <Logo size={40} />

            <div>
              <p className="text-sm font-semibold tracking-tight text-[#F5F1F4]">
                Borrower Copilot
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#716873]">
                Financial intelligence
              </p>
            </div>
          </div>

          {/* Private Assessment */}

          <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#817783]">
            <ShieldCheck
              size={14}
              className="text-[#39D39F]"
            />

            <span className="hidden sm:inline">
              Private assessment
            </span>

            <span className="sm:hidden">
              Private
            </span>
          </div>
        </header>

        {/* ===================================================
            HERO
        ==================================================== */}

        <section className="relative flex flex-1 items-center py-12 sm:py-16 lg:py-10">
          <div className="grid w-full items-center gap-4 lg:grid-cols-[46%_54%]">
            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div className="relative z-30 max-w-[680px]">
              {/* Badge */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#9C4C91]/30 bg-[#6D3B63]/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C995C0]">
                <CircleDollarSign size={14} />

                Indian borrower intelligence
              </div>

              {/* Heading */}

              <h1 className="text-[50px] font-semibold leading-[0.97] tracking-[-0.06em] sm:text-[64px] lg:text-[72px] xl:text-[80px]">
                <span className="text-[#F5F1F4]">
                  Borrow with
                </span>

                <br />

                <span className="bg-gradient-to-r from-[#F0D7EA] via-[#D79CC9] to-[#B85BA8] bg-clip-text text-transparent">
                  financial clarity.
                </span>
              </h1>

              {/* Description */}

              <p className="mt-7 max-w-[620px] text-[15px] leading-7 text-[#958B94] sm:text-[17px] sm:leading-8">
                Understand how much you can safely
                borrow, what EMI you can carry, and
                what a fair borrowing cost looks like —
                before you speak to a lender.
              </p>

              {/* CTA */}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onStart}
                  className="group inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#8C2F78] via-[#A43D91] to-[#C75BB0] px-6 text-sm font-semibold text-white shadow-[0_14px_38px_rgba(164,61,145,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(164,61,145,0.4)]"
                >
                  Start assessment

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

                <div className="flex items-center gap-2 text-xs text-[#716873]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#27D7A0]" />

                  Takes about 5 minutes
                </div>
              </div>

              {/* =================================================
                  FEATURE CARDS
              ================================================== */}

              <div className="mt-10 grid max-w-[680px] grid-cols-1 gap-3 sm:grid-cols-3">
                <FeatureCard
                  icon={
                    <CircleDollarSign size={18} />
                  }
                  title="Safe amount"
                  description="Know your assessed borrowing ceiling."
                />

                <FeatureCard
                  icon={
                    <BarChart3 size={18} />
                  }
                  title="Stress tested"
                  description="See how EMI behaves under pressure."
                />

                <FeatureCard
                  icon={
                    <ShieldCheck size={18} />
                  }
                  title="Independent"
                  description="Built for clarity, not loan selling."
                />
              </div>
            </div>

            {/* =================================================
                PURE CODE FINTECH VISUAL
            ================================================== */}

            <div className="relative flex min-h-[500px] items-center justify-center lg:min-h-[650px]">
              <FintechVisual />
            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="relative z-30 flex flex-col gap-2 border-t border-white/[0.055] py-5 text-[10px] text-[#5F5760] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Borrower Copilot · Financial self-assessment build by rishabh.
          </span>

          <span>
            Educational tool · Not a loan approval
          </span>
        </footer>
      </div>
    </main>
  );
}

/* =========================================================
   PURE CSS / HTML FINTECH VISUAL
========================================================= */

function FintechVisual() {
  return (
    <div className="relative h-[520px] w-full max-w-[720px]">
      {/* ===================================================
          CENTRAL GLOW
      ==================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[54%] h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B33C9B]/20 blur-[100px]" />

      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[260px] w-[460px] -translate-x-1/2 rounded-full bg-[#FF35C8]/10 blur-[80px]" />

      {/* ===================================================
          ORBIT RINGS
      ==================================================== */}

      <div className="absolute left-1/2 top-[58%] h-[390px] w-[570px] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-[50%] border border-[#A33E91]/20" />

      <div className="absolute left-1/2 top-[58%] h-[310px] w-[500px] -translate-x-1/2 -translate-y-1/2 rotate-[7deg] rounded-[50%] border border-[#D34CB8]/15" />

      <div className="absolute left-1/2 top-[58%] h-[230px] w-[410px] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded-[50%] border border-[#A33E91]/10" />

      {/* ===================================================
          LOAN CAPACITY CARD
      ==================================================== */}

      <MetricCard
        className="absolute left-[8%] top-[7%] z-30 rotate-[-5deg]"
        icon={<BarChart3 size={20} />}
        label="Loan Capacity"
        value="₹4.80L"
        change="+12.4%"
      />

      {/* ===================================================
          SAFE EMI CARD
      ==================================================== */}

      <MetricCard
        className="absolute right-[8%] top-[13%] z-30 rotate-[4deg]"
        icon={<WalletCards size={20} />}
        label="Safe EMI"
        value="₹16.4K"
      />

      {/* ===================================================
          FAIR RATE CARD
      ==================================================== */}

      <div className="absolute right-[0%] top-[39%] z-30 rotate-[5deg] rounded-2xl border border-[#D04DB8]/30 bg-[#150E16]/85 px-5 py-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A33E91]/20 text-[#E17ACB]">
            <span className="text-lg font-bold">
              %
            </span>
          </div>

          <span className="text-[10px] font-medium text-[#988C97]">
            Fair Rate
          </span>
        </div>

        <p className="mt-2 text-xl font-semibold tracking-tight text-[#F4EAF2]">
          11.5–13%
        </p>
      </div>

      {/* ===================================================
          MAIN BANK
      ==================================================== */}

      <div className="absolute left-1/2 top-[51%] z-20 h-[230px] w-[390px] -translate-x-1/2 -translate-y-1/2">
        {/* Building glow */}

        <div className="absolute left-1/2 top-[45%] h-[170px] w-[330px] -translate-x-1/2 -translate-y-1/2 bg-[#E02DBB]/10 blur-[55px]" />

        {/* Roof glow */}

        <div className="absolute left-1/2 top-0 h-[5px] w-[300px] -translate-x-1/2 rounded-full bg-[#F23BCB] shadow-[0_0_25px_rgba(242,59,203,0.9)]" />

        {/* Main roof */}

        <div
          className="absolute left-1/2 top-[13px] h-[74px] w-[340px] -translate-x-1/2 -skew-x-[18deg] border border-[#D75CC1]/70 bg-gradient-to-br from-[#44203F] via-[#241328] to-[#120D16] shadow-[0_15px_35px_rgba(204,45,178,0.25)]"
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_17px,rgba(219,112,199,0.12)_18px,transparent_20px)]" />
        </div>

        {/* Roof front */}

        <div className="absolute left-1/2 top-[74px] h-[17px] w-[360px] -translate-x-1/2 border border-[#EA63CF]/70 bg-gradient-to-r from-[#7C246D] via-[#D13EB6] to-[#7C246D] shadow-[0_0_22px_rgba(224,45,187,0.55)]" />

        {/* Building body */}

        <div className="absolute left-1/2 top-[91px] h-[100px] w-[320px] -translate-x-1/2 border-x border-[#9D438D]/50 bg-gradient-to-b from-[#261326] to-[#100C13] shadow-[inset_0_0_40px_rgba(190,48,163,0.08)]">
          {/* Columns */}

          <div className="flex h-full items-end justify-center gap-5 px-7">
            <BankColumn />
            <BankColumn />
            <BankColumn />
            <BankColumn />
          </div>
        </div>

        {/* Bottom platform */}

        <div className="absolute bottom-[17px] left-1/2 h-[18px] w-[350px] -translate-x-1/2 rounded-sm border border-[#D957C0]/60 bg-gradient-to-r from-[#35162F] via-[#9B2F86] to-[#35162F] shadow-[0_0_20px_rgba(217,87,192,0.35)]" />

        {/* Base */}

        <div className="absolute bottom-0 left-1/2 h-[17px] w-[370px] -translate-x-1/2 rounded-sm bg-[#120B13] shadow-[0_10px_35px_rgba(0,0,0,0.5)]" />

        {/* Rupee */}

        <div className="absolute left-1/2 top-[48px] z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-xl border border-[#F16BD5]/50 bg-[#170D18]/90 text-3xl font-bold text-[#FF67D9] shadow-[0_0_30px_rgba(241,107,213,0.55)]">
          ₹
        </div>
      </div>

      {/* ===================================================
          LOAN DOCUMENT
      ==================================================== */}

      <div className="absolute bottom-[3%] left-[9%] z-30 h-[135px] w-[205px] -rotate-[14deg] rounded-xl border border-[#CA4AB0]/40 bg-gradient-to-br from-[#3A1835] to-[#120B14] p-5 shadow-[0_25px_45px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <FileText
            size={22}
            className="text-[#ED72D6]"
          />

          <span className="text-[9px] uppercase tracking-widest text-[#987A91]">
            Loan
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-24 rounded-full bg-[#B4429E]/70" />
          <div className="h-1.5 w-32 rounded-full bg-[#6B3560]/70" />
          <div className="h-1.5 w-20 rounded-full bg-[#6B3560]/70" />
        </div>

        <div className="absolute bottom-4 right-5 text-xl italic text-[#D86AC5]">
          〰
        </div>
      </div>

      {/* ===================================================
          COIN STACKS
      ==================================================== */}

      <CoinStack
        className="absolute bottom-[12%] right-[13%] z-30"
        height={5}
      />

      <CoinStack
        className="absolute bottom-[7%] right-[28%] z-30 scale-90"
        height={4}
      />

      <CoinStack
        className="absolute bottom-[17%] right-[3%] z-30 scale-75"
        height={3}
      />

      {/* ===================================================
          BOTTOM DECISION CARD
      ==================================================== */}

      <div className="absolute bottom-[1%] right-[20%] z-40 rotate-[-5deg] rounded-xl border border-[#B746A1]/35 bg-[#150D17]/90 px-5 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <TrendingUp
            size={20}
            className="text-[#DC67C5]"
          />

          <div>
            <p className="text-[10px] text-[#C49CB9]">
              Better Decisions
            </p>

            <p className="text-sm font-semibold text-[#F3E8F0]">
              Brighter Future
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          FLOATING PARTICLES
      ==================================================== */}

      <div className="absolute left-[2%] top-[50%] h-2 w-2 rounded-full bg-[#FF3AC9] shadow-[0_0_18px_#FF3AC9]" />

      <div className="absolute left-[25%] top-[19%] h-1.5 w-1.5 rounded-full bg-[#D45CC0] shadow-[0_0_15px_#D45CC0]" />

      <div className="absolute right-[25%] top-[4%] h-1.5 w-1.5 rounded-full bg-[#FF64D9] shadow-[0_0_15px_#FF64D9]" />

      <div className="absolute bottom-[19%] left-[37%] h-1.5 w-1.5 rounded-full bg-[#A74395] shadow-[0_0_12px_#A74395]" />
    </div>
  );
}

/* =========================================================
   BANK COLUMN
========================================================= */

function BankColumn() {
  return (
    <div className="relative h-[85px] w-10">
      <div className="absolute bottom-0 left-1/2 h-[72px] w-6 -translate-x-1/2 rounded-sm border-x border-[#A54B94]/50 bg-gradient-to-r from-[#31172D] via-[#6F2B60] to-[#281326]">
        <div className="absolute left-1/2 top-1/2 h-[60px] w-1 -translate-x-1/2 bg-[#C454AC]/25" />
      </div>

      <div className="absolute bottom-[67px] left-1/2 h-3 w-10 -translate-x-1/2 rounded-sm border border-[#C557B1]/50 bg-[#542047]" />

      <div className="absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-sm bg-[#261225]" />
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  className,
  icon,
  label,
  value,
  change,
}: {
  className: string;
  icon: ReactNode;
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <div
      className={`${className} w-[190px] rounded-2xl border border-[#B84BA5]/35 bg-[#150D16]/90 p-4 shadow-[0_25px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A33E91]/20 text-[#E269CB]">
          {icon}
        </div>

        <span className="text-[10px] font-medium text-[#A696A2]">
          {label}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold tracking-tight text-[#F6EDF4]">
          {value}
        </p>

        {change && (
          <span className="text-[10px] font-semibold text-[#35D29F]">
            ↗ {change}
          </span>
        )}
      </div>

      {/* Mini chart */}

      <div className="mt-3 flex h-8 items-end gap-1">
        <span className="h-2 w-5 rounded-t bg-[#7E286E]" />
        <span className="h-3 w-5 rounded-t bg-[#8E307C]" />
        <span className="h-5 w-5 rounded-t bg-[#A43D91]" />
        <span className="h-4 w-5 rounded-t bg-[#B84BA5]" />
        <span className="h-7 w-5 rounded-t bg-[#D04DB8]" />
        <span className="h-5 w-5 rounded-t bg-[#A43D91]" />
        <span className="h-6 w-5 rounded-t bg-[#C24CAE]" />
      </div>
    </div>
  );
}

/* =========================================================
   COIN STACK
========================================================= */

function CoinStack({
  className,
  height,
}: {
  className: string;
  height: number;
}) {
  return (
    <div
      className={`${className} relative flex w-[72px] flex-col-reverse items-center`}
    >
      {Array.from({ length: height }).map(
        (_, index) => (
          <div
            key={index}
            className="-mb-1 flex h-5 w-[68px] items-center justify-center rounded-[50%] border border-[#D75BC1]/60 bg-gradient-to-r from-[#3A1734] via-[#A3318D] to-[#401A39] text-xs font-bold text-[#F58DDE] shadow-[0_5px_12px_rgba(0,0,0,0.35)]"
          >
            ₹
          </div>
        ),
      )}
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.075] bg-[#100D12]/65 p-4 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A66A96]/20 hover:bg-[#151016]/80">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#A66A96]/10 bg-[#6D3B63]/15 text-[#C17AAF]">
        {icon}
      </div>

      <p className="text-sm font-semibold text-[#E5DEE3]">
        {title}
      </p>

      <p className="mt-1.5 text-[11px] leading-5 text-[#716873]">
        {description}
      </p>
    </div>
  );
}