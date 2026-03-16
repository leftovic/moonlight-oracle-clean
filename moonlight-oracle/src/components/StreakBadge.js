"use client";

import { useState } from "react";

const STREAK_KEY = "moonlight-oracle-streak";

function readStreak() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (data.lastDate === today || data.lastDate === yesterday) return data.count;
    }
  } catch {}
  return 0;
}

export default function StreakBadge() {
  const [streak] = useState(readStreak);

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-2.5 animate-fade-in">
      <span className="text-amber text-sm">&#x2726;</span>
      <p className="text-amber/70 text-sm font-serif tracking-wide">
        {streak} night streak
      </p>
      <span className="text-amber text-sm">&#x2726;</span>
    </div>
  );
}
