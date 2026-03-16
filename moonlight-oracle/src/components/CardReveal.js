"use client";

import { useState } from "react";
import ShareButton from "@/components/ShareButton";

export default function CardReveal({ card, alreadyRevealed }) {
  const [revealed, setRevealed] = useState(alreadyRevealed);
  const [animating, setAnimating] = useState(false);

  const fallbackText = `Tonight\u2019s Moonlight Oracle card: ${card.title}\n\n${card.shortReading}\n\n\u{1F319} moonlightoracle.app`;

  function handleReveal() {
    if (revealed || animating) return;
    setAnimating(true);
    setRevealed(true);
    setTimeout(() => setAnimating(false), 900);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Card container with flip */}
      <button
        onClick={handleReveal}
        disabled={revealed}
        className="card-container w-72 cursor-pointer disabled:cursor-default focus:outline-none"
        style={{ height: "408px" }}
        aria-label={revealed ? card.title : "Reveal your card"}
      >
        <div className={`card-inner ${revealed ? "card-flipped" : ""}`}>
          {/* Card back */}
          <div className="card-face card-back rounded-2xl bg-navy-light border border-gold/20 flex flex-col items-center justify-center gap-5 p-10">
            <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center">
              <span className="text-5xl">🌙</span>
            </div>
            <p className="text-gold/60 text-base font-serif tracking-widest uppercase">
              Tap to reveal
            </p>
            <div className="w-16 h-px bg-gold/20" />
            <p className="text-indigo/60 text-sm font-serif">Moonlight Oracle</p>
          </div>

          {/* Card front */}
          <div
            className={`card-face card-front rounded-2xl bg-navy-light border border-gold/30 flex flex-col items-center justify-center gap-4 p-8 ${revealed ? "card-revealed-glow" : ""}`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-lavender/10 flex items-center justify-center mb-1">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gold tracking-wide">
              {card.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-2.5 mt-1">
              {card.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-sm text-lavender/80 border border-lavender/20 rounded-full px-3.5 py-1"
                >
                  {kw}
                </span>
              ))}
            </div>
            <div className="divider-gold w-20 my-2" />
            <p className="text-silver text-base leading-relaxed text-center">
              {card.shortReading}
            </p>
          </div>
        </div>
      </button>

      {/* Full reading below card */}
      {revealed && (
        <div className="mt-12 text-center animate-fade-in max-w-md px-2">
          {/* Night reading */}
          <p className="text-lavender/60 text-sm uppercase tracking-widest mb-5 font-serif">
            Tonight&rsquo;s Reading
          </p>
          <p className="text-silver/90 text-lg leading-relaxed">
            {card.nightReading}
          </p>

          <div className="divider-gold w-24 mx-auto my-6" />

          {/* Full reading */}
          <p className="text-silver/70 text-base leading-relaxed">
            {card.fullReading}
          </p>

          <div className="divider-gold w-16 mx-auto my-6" />

          {/* Affirmation */}
          <p className="text-gold/60 text-base italic font-serif">
            &ldquo;{card.affirmation}&rdquo;
          </p>

          {/* Tonight's advice */}
          {card.tonightAdvice && (
            <div className="mt-8 rounded-xl bg-navy-light/60 border border-indigo/15 px-5 py-4">
              <p className="text-indigo/60 text-xs uppercase tracking-widest mb-2 font-serif">
                Tonight&rsquo;s Advice
              </p>
              <p className="text-silver/80 text-sm leading-relaxed">
                {card.tonightAdvice}
              </p>
            </div>
          )}

          {/* Journal prompt */}
          {card.journalPrompt && (
            <div className="mt-4 rounded-xl bg-navy-light/60 border border-lavender/10 px-5 py-4">
              <p className="text-lavender/50 text-xs uppercase tracking-widest mb-2 font-serif">
                Journal Prompt
              </p>
              <p className="text-silver/70 text-sm leading-relaxed italic">
                {card.journalPrompt}
              </p>
            </div>
          )}

          {/* Share button */}
          <div className="mt-8">
            <ShareButton
              card={card}
              fileName="moonlight-oracle-daily"
              fallbackText={fallbackText}
            />
          </div>
        </div>
      )}
    </div>
  );
}
