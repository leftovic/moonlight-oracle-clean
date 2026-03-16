"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import StarField from "@/components/StarField";
import MoonPhase from "@/components/MoonPhase";

const YesNoContent = dynamic(
  () => import("@/components/YesNoContent"),
  {
    ssr: false,
    loading: () => (
      <p className="text-indigo text-base animate-pulse font-serif">
        The oracle is listening...
      </p>
    ),
  }
);

export default function YesNoPage() {
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
      <nav className="relative z-10 w-full max-w-lg flex items-center justify-between mb-14">
        <Link
          href="/"
          className="text-indigo/70 hover:text-lavender transition-colors text-base font-serif"
        >
          &larr; Home
        </Link>
        <h1 className="text-2xl font-serif font-semibold text-lavender tracking-wide">
          Yes / No Oracle
        </h1>
        <div className="w-14 flex justify-end">
          <MoonPhase compact />
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center flex-1 w-full max-w-lg">
        <YesNoContent />
      </main>
    </div>
  );
}
