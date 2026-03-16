"use client";

import { useState, useCallback } from "react";
import cards from "../../content/cards.json";

const POSITIONS = ["Past", "Present", "Future"];

const POSITION_COLORS = {
  Past: { text: "text-lavender", border: "border-lavender/30", label: "text-lavender/60" },
  Present: { text: "text-gold", border: "border-gold/30", label: "text-gold/60" },
  Future: { text: "text-mist", border: "border-mist/30", label: "text-mist/60" },
};

function drawThree() {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default function ThreeCardContent() {
  const [spread, setSpread] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [dealing, setDealing] = useState(false);

  const dealCards = useCallback(() => {
    if (dealing) return;
    setDealing(true);
    setSpread(null);
    setRevealedCount(0);

    setTimeout(() => {
      setSpread(drawThree());
      setDealing(false);
    }, 800);
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
            Three cards for past, present, and future
          </p>
          <p className="text-indigo/50 text-sm">
            Focus on what you&rsquo;d like insight into
          </p>
        </div>
      )}

      {/* Deal button */}
      {!spread && (
        <button
          onClick={dealCards}
          disabled={dealing}
          className="btn-oracle py-5 px-12 rounded-xl bg-navy-light border border-mist/30 text-mist font-serif font-semibold text-xl tracking-wide disabled:opacity-50 cursor-pointer disabled:cursor-wait"
        >
          {dealing ? "Dealing..." : "Draw 3 Cards"}
        </button>
      )}

      {/* Dealing animation */}
      {dealing && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-mist/20 flex items-center justify-center animate-pulse">
            <span className="text-2xl">&#x2728;</span>
          </div>
          <p className="text-indigo/60 text-sm font-serif animate-pulse">
            The cards are being drawn...
          </p>
        </div>
      )}

      {/* Cards */}
      {spread && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 w-full mb-10">
              {spread.map((card, i) => {
                const position = POSITIONS[i];
                const colors = POSITION_COLORS[position];
                const isRevealed = i < revealedCount;
                const isNext = i === revealedCount;

                return (
                  <div
                    key={card.id}
                    className="flex flex-col items-center animate-fade-in"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    {/* Position label */}
                    <p className={`text-sm uppercase tracking-widest mb-4 font-serif ${colors.label}`}>
                      {position}
                    </p>

                    {/* Card */}
                    {isRevealed ? (
                      <div className={`w-full rounded-2xl bg-navy-light border ${colors.border} p-6 card-revealed-glow`}>
                        <div className="flex flex-col items-center text-center gap-2.5">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/15 to-lavender/10 flex items-center justify-center mb-1">
                            <span className="text-xl">&#x2728;</span>
                          </div>
                          <h2 className={`text-2xl font-serif font-bold tracking-wide ${colors.text}`}>
                            {card.title}
                          </h2>
                          <div className="flex flex-wrap justify-center gap-2 mt-1">
                            {card.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-sm text-silver/60 border border-silver/15 rounded-full px-3 py-0.5"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div className="divider-gold w-14 my-2.5" />
                          <p className="text-silver/80 text-base leading-relaxed">
                            {card.shortReading}
                          </p>
                          <p className="text-silver/60 text-sm leading-relaxed mt-2">
                            {card.fullReading}
                          </p>
                          {card.tonightAdvice && (
                            <p className="text-indigo/60 text-xs leading-relaxed mt-3 italic">
                              {card.tonightAdvice}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={isNext ? revealNext : undefined}
                        disabled={!isNext}
                        className={`w-full rounded-2xl bg-navy-light border border-indigo/20 p-6 flex flex-col items-center justify-center gap-4 transition-all ${isNext ? "cursor-pointer hover:border-indigo/40" : "cursor-default opacity-50"}`}
                        style={{ minHeight: "216px" }}
                      >
                        <div className="w-14 h-14 rounded-full border border-indigo/20 flex items-center justify-center">
                          <span className="text-2xl">&#127769;</span>
                        </div>
                        <p className="text-indigo/50 text-sm font-serif tracking-widest uppercase">
                          {isNext ? "Tap to reveal" : "Waiting"}
                        </p>
                      </button>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Draw again */}
          {revealedCount === 3 && (
            <div className="flex flex-col items-center gap-5 mt-5 animate-fade-in">
              <div className="divider-gold w-28" />
              <button
                onClick={dealCards}
                className="btn-oracle py-3.5 px-10 rounded-xl bg-navy-light border border-mist/20 text-mist/80 font-serif text-base tracking-wide cursor-pointer"
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
