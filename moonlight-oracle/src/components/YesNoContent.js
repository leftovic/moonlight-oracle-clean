"use client";

import { useState, useCallback } from "react";
import answers from "../../content/yes_no_oracle.json";

const STORAGE_KEY = "moonlight-oracle-yesno";

function pickRandom() {
  return answers[Math.floor(Math.random() * answers.length)];
}

function saveResult(result) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

const ANSWER_COLORS = {
  Yes: "text-gold",
  No: "text-lavender",
  Maybe: "text-mist",
};

const ANSWER_BORDER = {
  Yes: "border-gold/30",
  No: "border-lavender/30",
  Maybe: "border-mist/30",
};

export default function YesNoContent() {
  const [result, setResult] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const askOracle = useCallback(() => {
    if (revealing) return;
    setRevealing(true);
    setResult(null);

    setTimeout(() => {
      const picked = pickRandom();
      setResult(picked);
      setHasAsked(true);
      setRevealing(false);
      saveResult({ ...picked, timestamp: Date.now() });
    }, 1200);
  }, [revealing]);

  return (
    <div className="flex flex-col items-center">
      {/* Prompt */}
      <p className="text-silver/70 text-base font-serif text-center mb-2.5 animate-fade-in">
        Hold a yes-or-no question in your mind
      </p>
      <p className="text-indigo/50 text-sm text-center mb-12 animate-fade-in">
        When you&rsquo;re ready, ask the oracle
      </p>

      {/* Ask button */}
      <button
        onClick={askOracle}
        disabled={revealing}
        className="btn-oracle py-5 px-12 rounded-xl bg-navy-light border border-lavender/30 text-lavender font-serif font-semibold text-xl tracking-wide disabled:opacity-50 cursor-pointer disabled:cursor-wait"
      >
        {revealing ? "Listening..." : hasAsked ? "Ask Again" : "Ask the Oracle"}
      </button>

      {/* Revealing animation */}
      {revealing && (
        <div className="mt-14 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-lavender/20 flex items-center justify-center animate-pulse">
            <span className="text-2xl">&#x2728;</span>
          </div>
          <p className="text-indigo/60 text-sm font-serif animate-pulse">
            The oracle stirs...
          </p>
        </div>
      )}

      {/* Result */}
      {result && !revealing && (
        <div className="mt-14 flex flex-col items-center animate-fade-in">
          {/* Answer orb */}
          <div
            className={`rounded-full bg-navy-light border ${ANSWER_BORDER[result.answer]} flex items-center justify-center mb-7 card-revealed-glow`}
            style={{ width: "136px", height: "136px" }}
          >
            <span className={`text-4xl font-serif font-bold tracking-wide ${ANSWER_COLORS[result.answer]}`}>
              {result.answer}
            </span>
          </div>

          {/* Message */}
          <p className="text-silver/90 text-lg font-serif leading-relaxed text-center max-w-sm mb-5">
            {result.message}
          </p>

          <div className="divider-gold w-24 my-3" />

          {/* Tone hint */}
          <p className="text-indigo/50 text-sm tracking-widest uppercase mt-3">
            {result.tone}
          </p>
        </div>
      )}
    </div>
  );
}
