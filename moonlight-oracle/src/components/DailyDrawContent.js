"use client";

import { useState } from "react";
import Link from "next/link";
import CardReveal from "@/components/CardReveal";
import cards from "../../content/cards.json";

const DRAW_KEY = "moonlight-oracle-daily-draw";
const STREAK_KEY = "moonlight-oracle-streak";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastDate: null };
}

function updateStreak(isNewDraw) {
  const streak = loadStreak();
  const today = getTodayKey();

  if (streak.lastDate === today) return streak;
  if (!isNewDraw) return streak;

  const yesterday = getYesterdayKey();
  if (streak.lastDate === yesterday) {
    streak.count += 1;
  } else {
    streak.count = 1;
  }
  streak.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak;
}

function resolveDraw() {
  let alreadyDrawn = false;
  let card;

  try {
    const raw = localStorage.getItem(DRAW_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.date === getTodayKey()) {
        const found = cards.find((c) => c.id === saved.cardId);
        if (found) {
          card = found;
          alreadyDrawn = true;
        }
      }
    }
  } catch {}

  if (!card) {
    const index = Math.floor(Math.random() * cards.length);
    card = cards[index];
    localStorage.setItem(
      DRAW_KEY,
      JSON.stringify({ date: getTodayKey(), cardId: card.id })
    );
  }

  const streak = updateStreak(!alreadyDrawn);
  return { card, alreadyDrawn, streak: streak.count };
}

export default function DailyDrawContent() {
  const [drawState] = useState(resolveDraw);

  return (
    <div className="flex flex-col items-center">
      {/* Streak display */}
      {drawState.streak > 0 && (
        <div className="mb-7 flex items-center gap-2.5 animate-fade-in">
          <span className="text-amber text-base">&#x2726;</span>
          <p className="text-amber/80 text-base font-serif tracking-wide">
            {drawState.streak} night{drawState.streak !== 1 ? "s" : ""} in a row
          </p>
          <span className="text-amber text-base">&#x2726;</span>
        </div>
      )}

      {drawState.alreadyDrawn && (
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-lavender/70 text-base font-serif tracking-wide">
            You already drew today&rsquo;s card
          </p>
          <p className="text-indigo/50 text-sm mt-1.5">
            Here is your reading for tonight
          </p>
        </div>
      )}

      {!drawState.alreadyDrawn && (
        <p className="text-lavender/50 text-sm tracking-widest uppercase mb-10 font-serif animate-fade-in">
          Your card awaits
        </p>
      )}

      <CardReveal
        card={drawState.card}
        alreadyRevealed={drawState.alreadyDrawn}
      />

      {drawState.alreadyDrawn && (
        <div className="mt-14 flex flex-col items-center gap-5 animate-fade-in">
          <div className="divider-gold w-28" />
          <p className="text-indigo/60 text-base font-serif">
            Return tomorrow for a new drawing
          </p>
          <Link
            href="/"
            className="text-gold/50 hover:text-gold/80 transition-colors text-sm tracking-wide"
          >
            &larr; Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
