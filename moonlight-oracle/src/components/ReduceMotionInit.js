"use client";

import { useEffect } from "react";

export default function ReduceMotionInit() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("moonlight-oracle-settings");
      if (raw) {
        const settings = JSON.parse(raw);
        if (settings.reduceMotion) {
          document.documentElement.classList.add("reduce-motion");
        }
      }
    } catch {}
  }, []);

  return null;
}
