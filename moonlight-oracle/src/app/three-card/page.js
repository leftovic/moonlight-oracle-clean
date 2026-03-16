"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import StarField from "@/components/StarField";
import MoonPhase from "@/components/MoonPhase";

const ThreeCardContent = dynamic(
  () => import("@/components/ThreeCardContent"),
  {
    ssr: false,
    loading: () => (
      <p className="text-indigo text-base animate-pulse font-serif">
        Shuffling the deck...
      </p>
    ),
  }
);

export default function ThreeCardPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 pt-14 pb-24 overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(74, 78, 122, 0.18) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <StarField />

      {/* Header */}
      <nav className="relative z-10 w-full max-w-3xl flex items-center justify-between mb-14">
        <Link
          href="/"
          className="text-indigo/70 hover:text-lavender transition-colors text-base font-serif"
        >
          &larr; Home
        </Link>
        <h1 className="text-2xl font-serif font-semibold text-mist tracking-wide">
          3-Card Spread
        </h1>
        <div className="w-14 flex justify-end">
          <MoonPhase compact />
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center flex-1 w-full max-w-3xl">
        <ThreeCardContent />
      </main>
    </div>
  );
}
