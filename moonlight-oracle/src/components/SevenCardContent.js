"use client";

import { useState, useCallback } from "react";
import cards from "../../content/cards.json";

const POSITIONS = [
  "The Past",
  "The Present",
  "The Future",
  "The Challenge",
  "The Influence",
  "The Hope",
  "The Outcome",
];

const POSITION_COLORS = {
  "The Past":      { text: "text-lavender", border: "border-lavender/30", label: "text-lavender/60" },
  "The Present":   { text: "text-gold", border: "border-gold/30", label: "text-gold/60" },
  "The Future":    { text: "text-mist", border: "border-mist/30", label: "text-mist/60" },
  "The Challenge": { text: "text-amber", border: "border-amber/30", label: "text-amber/60" },
  "The Influence": { text: "text-silver", border: "border-silver/30", label: "text-silver/60" },
  "The Hope":      { text: "text-lavender", border: "border-lavender/30", label: "text-lavender/60" },
  "The Outcome":   { text: "text-gold", border: "border-gold/30", label: "text-gold/60" },
};

const POSITION_DESCRIPTIONS = {
  "The Past": "What shaped you",
  "The Present": "Where you stand",
  "The Future": "What approaches",
  "The Challenge": "What tests you",
  "The Influence": "What guides you",
  "The Hope": "What you wish for",
  "The Outcome": "Where this leads",
};

function drawSeven() {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
}

export default function SevenCardContent() {
  const [spread, setSpread] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [dealing, setDealing] = useState(false);

  const dealCards = useCallback(() => {
    if (dealing) return;
    setDealing(true);
    setSpread(null);
    setRevealedCount(0);

    setTimeout(() => {
      setSpread(drawSeven());
      setDealing(false);
    }, 1000);
  }, [dealing]);

  const revealNext = useCallback(() => {
    setRevealedCount((c) => c + 1);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Prompt */}
      {!spread && !dealing && (
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-silver/70 text-base font-serif mb-2.5">
            Seven cards for a deeper reading
          </p>
          <p className="text-indigo/50 text-sm">
            Past, present, future, challenge, influence, hope, and outcome
          </p>
        </div>
      )}

      {/* Deal button */}
      {!spread && (
        <button
          onClick={dealCards}
          disabled={dealing}
          className="btn-oracle py-5 px-12 rounded-xl bg-navy-light border border-amber/30 text-amber font-serif font-semibold text-xl tracking-wide disabled:opacity-50 cursor-pointer disabled:cursor-wait"
        >
          {dealing ? "Dealing..." : "Draw 7 Cards"}
        </button>
      )}

      {/* Dealing animation */}
      {dealing && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-amber/20 flex items-center justify-center animate-pulse">
            <span className="text-2xl">&#x2728;</span>
          </div>
          <p className="text-indigo/60 text-sm font-serif animate-pulse">
            The oracle lays your cards...
          </p>
        </div>
      )}

      {/* Cards */}
      {spread && (
        <>
          {/* Top row: 4 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full mb-5">
            {spread.slice(0, 4).map((card, i) => (
              <SpreadCard
                key={card.id}
                card={card}
                position={POSITIONS[i]}
                index={i}
                isRevealed={i < revealedCount}
                isNext={i === revealedCount}
                onReveal={revealNext}
              />
            ))}
          </div>

          {/* Bottom row: 3 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full max-w-3xl mb-10">
            {spread.slice(4, 7).map((card, i) => (
              <SpreadCard
                key={card.id}
                card={card}
                position={POSITIONS[i + 4]}
                index={i + 4}
                isRevealed={i + 4 < revealedCount}
                isNext={i + 4 === revealedCount}
                onReveal={revealNext}
              />
            ))}
          </div>

          {/* Draw again */}
          {revealedCount === 7 && (
            <div className="flex flex-col items-center gap-5 mt-5 animate-fade-in">
              <div className="divider-gold w-28" />
              <button
                onClick={dealCards}
                className="btn-oracle py-3.5 px-10 rounded-xl bg-navy-light border border-amber/20 text-amber/80 font-serif text-base tracking-wide cursor-pointer"
              >
                Draw Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SpreadCard({ card, position, index, isRevealed, isNext, onReveal }) {
  const colors = POSITION_COLORS[position];
  const desc = POSITION_DESCRIPTIONS[position];

  return (
    <div
      className="flex flex-col items-center animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Position label */}
      <p className={`text-xs uppercase tracking-widest mb-2 font-serif ${colors.label}`}>
        {position}
      </p>
      <p className="text-indigo/30 text-xs mb-3 font-serif">
        {desc}
      </p>

      {/* Card */}
      {isRevealed ? (
        <div className={`w-full rounded-2xl bg-navy-light border ${colors.border} p-5 card-revealed-glow`}>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/15 to-lavender/10 flex items-center justify-center mb-1">
              <span className="text-lg">&#x2728;</span>
            </div>
            <h2 className={`text-xl font-serif font-bold tracking-wide ${colors.text}`}>
              {card.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-1.5 mt-1">
              {card.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs text-silver/60 border border-silver/15 rounded-full px-2.5 py-0.5"
                >
                  {kw}
                </span>
              ))}
            </div>
            <div className="divider-gold w-12 my-2" />
            <p className="text-silver/80 text-sm leading-relaxed">
              {card.shortReading}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={isNext ? onReveal : undefined}
          disabled={!isNext}
          className={`w-full rounded-2xl bg-navy-light border border-indigo/20 p-5 flex flex-col items-center justify-center gap-3 transition-all ${isNext ? "cursor-pointer hover:border-indigo/40" : "cursor-default opacity-50"}`}
          style={{ minHeight: "180px" }}
        >
          <div className="w-12 h-12 rounded-full border border-indigo/20 flex items-center justify-center">
            <span className="text-xl">&#127769;</span>
          </div>
          <p className="text-indigo/50 text-xs font-serif tracking-widest uppercase">
            {isNext ? "Tap to reveal" : "Waiting"}
          </p>
        </button>
      )}
    </div>
  );
}
