"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import wisdomData from "../../content/wisdom.json";

// ── Deterministic seeded random ──
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Static stars rendered to a single canvas (no DOM per star) ──
function drawStarCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const rand = seededRandom(42);
  const COLORS = [
    [196, 202, 212], [184, 169, 212], [212, 194, 142],
    [123, 155, 181], [169, 212, 184], [212, 169, 169],
  ];

  for (let i = 0; i < 220; i++) {
    const cIdx = rand();
    let ci;
    if (cIdx < 0.55) ci = 0;
    else if (cIdx < 0.70) ci = 1;
    else if (cIdx < 0.82) ci = 2;
    else if (cIdx < 0.90) ci = 3;
    else if (cIdx < 0.95) ci = 4;
    else ci = 5;

    const sizeRand = rand();
    const size = sizeRand < 0.1 ? 2.5 : sizeRand < 0.3 ? 2 : sizeRand < 0.55 ? 1.5 : 1;
    const x = rand() * w;
    const y = rand() * h;
    const alpha = 0.3 + rand() * 0.5;
    const [r, g, b] = COLORS[ci];

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }
}

// ── Small set of animated twinkling stars (DOM, but only 30) ──
function generateTwinklers(count) {
  const rand = seededRandom(77);
  const stars = [];
  const COLORS = [
    "rgba(196, 202, 212, 0.9)", "rgba(184, 169, 212, 0.85)",
    "rgba(212, 194, 142, 0.8)", "rgba(123, 155, 181, 0.85)",
  ];
  for (let i = 0; i < count; i++) {
    stars.push({
      top: `${(rand() * 100).toFixed(2)}%`,
      left: `${(rand() * 100).toFixed(2)}%`,
      size: 1.5 + rand() * 1.5,
      duration: `${(3 + rand() * 4).toFixed(1)}s`,
      delay: `${(rand() * 5).toFixed(1)}s`,
      color: COLORS[Math.floor(rand() * COLORS.length)],
    });
  }
  return stars;
}

const TWINKLERS = generateTwinklers(18);

// ── Nebulae (deterministic) ──
function generateNebulae() {
  const rand = seededRandom(99);
  const configs = [
    { color: "74, 78, 122", opacity: 0.08, size: 450 },
    { color: "184, 169, 212", opacity: 0.05, size: 380 },
    { color: "212, 194, 142", opacity: 0.035, size: 400 },
    { color: "123, 155, 181", opacity: 0.055, size: 350 },
    { color: "160, 130, 190", opacity: 0.04, size: 320 },
  ];
  return configs.map((cfg, i) => {
    const w = cfg.size + rand() * 150;
    const h = cfg.size + rand() * 100;
    return {
      top: `${(5 + rand() * 70).toFixed(0)}%`,
      left: `${(5 + rand() * 70).toFixed(0)}%`,
      width: w,
      height: h,
      bg: `radial-gradient(ellipse, rgba(${cfg.color}, ${cfg.opacity}), transparent 70%)`,
      driftX: 10 + rand() * 15,
      driftDur: 50 + rand() * 40,
      idx: i,
    };
  });
}

const NEBULAE = generateNebulae();

// ── Shooting star colors ──
const SHOOT_COLORS = [
  { head: "#c4cad4", trail: "rgba(196,202,212,0.4)" },
  { head: "#d4c28e", trail: "rgba(212,194,142,0.35)" },
  { head: "#b8a9d4", trail: "rgba(184,169,212,0.35)" },
  { head: "#7b9bb5", trail: "rgba(123,155,181,0.35)" },
];

// ── Comet colors ──
const COMET_COLORS = [
  { head: "#d4c28e", glow: "rgba(212,194,142,0.2)", trail: "rgba(212,194,142,0.06)" },
  { head: "#b8a9d4", glow: "rgba(184,169,212,0.2)", trail: "rgba(184,169,212,0.06)" },
  { head: "#7b9bb5", glow: "rgba(123,155,181,0.2)", trail: "rgba(123,155,181,0.06)" },
  { head: "#a9d4c8", glow: "rgba(169,212,200,0.15)", trail: "rgba(169,212,200,0.05)" },
];

function randomShootingStar() {
  const color = SHOOT_COLORS[Math.floor(Math.random() * SHOOT_COLORS.length)];
  return {
    id: Date.now() + Math.random(),
    top: Math.random() * 55,
    left: 5 + Math.random() * 80,
    angle: 18 + Math.random() * 25,
    duration: 2.0 + Math.random() * 1.8,
    length: 120 + Math.random() * 140,
    ...color,
  };
}

function randomComet() {
  const color = COMET_COLORS[Math.floor(Math.random() * COMET_COLORS.length)];
  return {
    id: Date.now() + Math.random(),
    top: 8 + Math.random() * 50,
    fromRight: Math.random() > 0.5,
    duration: 45 + Math.random() * 50,
    size: 3 + Math.random() * 2, // capped at 5px
    ...color,
  };
}

export default function HomeStarField() {
  const canvasRef = useRef(null);
  const [shootingStars, setShootingStars] = useState([]);
  const [comets, setComets] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimeout = useRef(null);
  const usedQuotes = useRef(new Set());

  // Draw static stars onto canvas
  useEffect(() => {
    if (canvasRef.current) drawStarCanvas(canvasRef.current);
    const handleResize = () => {
      if (canvasRef.current) drawStarCanvas(canvasRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Shooting stars every 2-6s
  useEffect(() => {
    let tid;
    function spawn() {
      setShootingStars((prev) => [...prev.slice(-2), randomShootingStar()]);
      tid = setTimeout(spawn, 2000 + Math.random() * 4000);
    }
    tid = setTimeout(spawn, 1500);
    return () => clearTimeout(tid);
  }, []);

  // Comets every 18-40s
  useEffect(() => {
    let tid;
    function spawn() {
      setComets((prev) => [...prev.slice(-1), randomComet()]);
      tid = setTimeout(spawn, 18000 + Math.random() * 22000);
    }
    tid = setTimeout(spawn, 6000);
    return () => clearTimeout(tid);
  }, []);

  const getWisdom = useCallback(() => {
    let available = wisdomData.filter((_, i) => !usedQuotes.current.has(i));
    if (available.length === 0) {
      usedQuotes.current.clear();
      available = wisdomData;
    }
    const idx = Math.floor(Math.random() * available.length);
    const originalIdx = wisdomData.indexOf(available[idx]);
    usedQuotes.current.add(originalIdx);
    const entry = available[idx];
    return entry.source ? `${entry.text} \u2014 ${entry.source}` : entry.text;
  }, []);

  const handleCelestialClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left + rect.width / 2, 160), window.innerWidth - 160);
    const y = rect.top - 10;
    clearTimeout(tooltipTimeout.current);
    setTooltip({ x, y, quote: getWisdom() });
    tooltipTimeout.current = setTimeout(() => setTooltip(null), 6000);
  }, [getWisdom]);

  const dismissTooltip = useCallback(() => {
    setTooltip(null);
    clearTimeout(tooltipTimeout.current);
  }, []);

  return (
    <>
      {/* Static stars canvas (behind everything) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
        {/* Nebula clouds */}
        {NEBULAE.map((n) => (
          <div
            key={`neb-${n.idx}`}
            className="nebula"
            style={{
              top: n.top,
              left: n.left,
              width: `${n.width}px`,
              height: `${n.height}px`,
              background: n.bg,
              "--nebula-drift": `${n.driftX}px`,
              "--nebula-duration": `${n.driftDur}s`,
            }}
          />
        ))}

        {/* Animated twinklers (small DOM set for sparkle effect) */}
        {TWINKLERS.map((star, i) => (
          <div
            key={`tw-${i}`}
            className="star pointer-events-auto cursor-pointer"
            onClick={handleCelestialClick}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.color,
              "--duration": star.duration,
              "--delay": star.delay,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shooting-star pointer-events-auto cursor-pointer"
            onClick={handleCelestialClick}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              "--shoot-angle": `${s.angle}deg`,
              "--shoot-duration": `${s.duration}s`,
              "--shoot-length": `${s.length}px`,
              "--shoot-head": s.head,
              "--shoot-trail": s.trail,
            }}
          />
        ))}

        {/* Comets */}
        {comets.map((c) => (
          <div
            key={c.id}
            className={`comet pointer-events-auto cursor-pointer ${c.fromRight ? "comet-rtl" : "comet-ltr"}`}
            onClick={handleCelestialClick}
            style={{
              top: `${c.top}%`,
              "--comet-duration": `${c.duration}s`,
              "--comet-head": c.head,
              "--comet-glow": c.glow,
              "--comet-trail": c.trail,
              "--comet-size": `${c.size}px`,
            }}
          />
        ))}
      </div>

      {/* Wisdom tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-auto cursor-pointer animate-fade-in"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          onClick={dismissTooltip}
        >
          <div className="wisdom-tooltip max-w-xs px-5 py-3.5 rounded-xl bg-navy-light/95 backdrop-blur-md border border-gold/20 shadow-lg">
            <p className="text-gold/80 text-sm font-serif leading-relaxed text-center italic">
              &ldquo;{tooltip.quote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </>
  );
}
