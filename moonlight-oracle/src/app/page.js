import Link from "next/link";
import HomeStarField from "@/components/HomeStarField";
import StreakBadge from "@/components/StreakBadge";
import MoonPhase from "@/components/MoonPhase";

export default function Home() {
  return (
    <>
      {/* Radial gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(74, 78, 122, 0.18) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <HomeStarField />

    <div className="relative flex min-h-screen flex-col items-center px-6 py-16 sm:py-20 overflow-x-hidden">

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center text-center max-w-xl w-full flex-1">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center mt-8 sm:mt-14">
          {/* Moon icon */}
          <div className="moon-glow w-28 h-28 rounded-full bg-navy-light border border-gold/20 flex items-center justify-center mb-8 animate-fade-in-up animate-delay-1">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-lavender/10 flex items-center justify-center">
              <span className="text-4xl" role="img" aria-label="Moon">
                🌙
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl font-serif font-bold text-gold tracking-wide mb-3 animate-fade-in-up animate-delay-2">
            Moonlight Oracle
          </h1>

          {/* Divider */}
          <div className="divider-gold w-40 my-5 animate-fade-in-up animate-delay-2" />

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-lavender/90 font-serif mb-6 animate-fade-in-up animate-delay-3">
            A nightly ritual of insight
          </p>

          {/* Moon phase */}
          <div className="mb-10 animate-fade-in-up animate-delay-3">
            <MoonPhase />
          </div>
        </section>

        {/* ── Welcome intro ── */}
        <section className="max-w-md mb-14 animate-fade-in-up animate-delay-3">
          <p className="text-silver/60 text-base sm:text-lg font-serif leading-relaxed">
            Draw a card, ask a question, or explore what the night has to offer.
            Each reading is a quiet moment between you and the stars.
          </p>
        </section>

        {/* ── Actions ── */}
        <section className="w-full max-w-sm animate-fade-in-up animate-delay-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/daily-draw"
              className="btn-oracle group w-full py-5 px-8 rounded-xl bg-navy-light border border-gold/30 flex items-center justify-between"
            >
              <div className="flex flex-col items-start">
                <span className="text-gold font-serif font-semibold text-2xl tracking-wide">
                  Daily Draw
                </span>
                <span className="text-indigo/50 text-sm font-serif mt-0.5">
                  One card, once a night
                </span>
              </div>
              <span className="text-gold/40 text-2xl group-hover:translate-x-1 transition-transform">
                &rsaquo;
              </span>
            </Link>

            <Link
              href="/yes-no"
              className="btn-oracle group w-full py-4 px-8 rounded-xl bg-navy-light border border-lavender/20 flex items-center justify-between"
            >
              <div className="flex flex-col items-start">
                <span className="text-lavender font-serif font-medium text-xl tracking-wide">
                  Yes / No Oracle
                </span>
                <span className="text-indigo/40 text-sm font-serif mt-0.5">
                  Ask and receive
                </span>
              </div>
              <span className="text-lavender/30 text-2xl group-hover:translate-x-1 transition-transform">
                &rsaquo;
              </span>
            </Link>

            <Link
              href="/three-card"
              className="btn-oracle group w-full py-4 px-8 rounded-xl bg-navy-light border border-mist/20 flex items-center justify-between"
            >
              <div className="flex flex-col items-start">
                <span className="text-mist font-serif font-medium text-xl tracking-wide">
                  3-Card Spread
                </span>
                <span className="text-indigo/40 text-sm font-serif mt-0.5">
                  Past, present, and future
                </span>
              </div>
              <span className="text-mist/30 text-2xl group-hover:translate-x-1 transition-transform">
                &rsaquo;
              </span>
            </Link>

            <Link
              href="/seven-card"
              className="btn-oracle group w-full py-4 px-8 rounded-xl bg-navy-light border border-amber/20 flex items-center justify-between"
            >
              <div className="flex flex-col items-start">
                <span className="text-amber font-serif font-medium text-xl tracking-wide">
                  7-Card Spread
                </span>
                <span className="text-indigo/40 text-sm font-serif mt-0.5">
                  A deeper reading across seven positions
                </span>
              </div>
              <span className="text-amber/30 text-2xl group-hover:translate-x-1 transition-transform">
                &rsaquo;
              </span>
            </Link>
          </div>

          {/* Streak */}
          <div className="mt-5 flex justify-center">
            <StreakBadge />
          </div>
        </section>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Footer ── */}
        <footer className="mt-16 flex flex-col items-center gap-3 animate-fade-in-up animate-delay-4">
          <div className="divider-gold w-24" />
          <p className="text-indigo/40 text-xs font-serif tracking-widest uppercase mt-2">
            Moonlight Oracle
          </p>
          <p className="text-indigo/30 text-xs">
            A quiet place for nightly reflection
          </p>
        </footer>
      </main>
    </div>
    </>
  );
}
