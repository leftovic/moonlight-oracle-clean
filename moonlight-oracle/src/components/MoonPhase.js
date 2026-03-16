"use client";

import phases from "../../content/moon_phases.json";

const SYNODIC_MONTH = 29.53059;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0); // Jan 6 2000

function getMoonPhaseIndex() {
  const now = Date.now();
  const daysSinceNew = (now - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const cyclePosition = ((daysSinceNew % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseIndex = Math.floor((cyclePosition / SYNODIC_MONTH) * 8) % 8;
  return phaseIndex;
}

export default function MoonPhase({ compact = false }) {
  const phase = phases[getMoonPhaseIndex()];

  if (compact) {
    return (
      <div className="flex items-center gap-2 animate-fade-in">
        <span className="text-base">{phase.emoji}</span>
        <span className="text-indigo/60 text-xs font-serif tracking-wide">
          {phase.phase}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">{phase.emoji}</span>
        <span className="text-silver/70 text-base font-serif tracking-wide">
          {phase.phase}
        </span>
      </div>
      <p className="text-indigo/60 text-sm font-serif italic">
        {phase.message}
      </p>
    </div>
  );
}
