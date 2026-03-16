"use client";

import { useState, useCallback } from "react";

function drawShareCard(card) {
  const W = 720;
  const H = 960;

  // Create canvas IN the DOM first — some browsers won't render fillText on detached canvases
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  canvas.style.position = "fixed";
  canvas.style.left = "-9999px";
  canvas.style.top = "0";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // ── Background ──
  ctx.fillStyle = "#0b1026";
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow
  const glow = ctx.createRadialGradient(W / 2, 180, 20, W / 2, 180, 300);
  glow.addColorStop(0, "rgba(212, 194, 142, 0.06)");
  glow.addColorStop(1, "rgba(13, 18, 48, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Stars ──
  const stars = [
    [120, 80], [580, 120], [90, 300], [640, 280], [200, 750],
    [520, 700], [360, 60], [60, 550], [660, 500], [300, 850],
    [450, 130], [150, 450], [550, 430], [400, 780], [80, 170],
    [680, 60], [40, 400], [350, 900], [600, 800], [250, 140],
  ];
  stars.forEach(([x, y], i) => {
    ctx.beginPath();
    ctx.arc(x, y, (i % 3 === 0) ? 1.5 : 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(196, 202, 212, ${0.15 + (i % 5) * 0.07})`;
    ctx.fill();
  });

  // ── Moon circle ──
  ctx.beginPath();
  ctx.arc(W / 2, 155, 48, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(212, 194, 142, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(212, 194, 142, 0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ── All text ──
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Moon emoji
  ctx.font = "36px serif";
  ctx.fillStyle = "#d4c28e";
  ctx.fillText("\u{1F319}", W / 2, 135);

  // Branding
  ctx.font = "12px Arial, sans-serif";
  ctx.fillStyle = "rgba(212, 194, 142, 0.45)";
  ctx.fillText("M O O N L I G H T   O R A C L E", W / 2, 220);

  // Divider
  drawDivider(ctx, W / 2, 250, 100);

  // Card title
  ctx.font = "bold 44px Georgia, Times New Roman, serif";
  ctx.fillStyle = "#d4c28e";
  ctx.fillText(card.title, W / 2, 274);

  // Keywords
  ctx.font = "16px Arial, sans-serif";
  ctx.fillStyle = "rgba(184, 169, 212, 0.75)";
  ctx.fillText(card.keywords.join("   \u00b7   "), W / 2, 330);

  // Divider
  drawDivider(ctx, W / 2, 365, 70);

  // Short reading
  ctx.font = "21px Georgia, Times New Roman, serif";
  ctx.fillStyle = "rgba(196, 202, 212, 0.92)";
  let y = 390;
  wrapText(ctx, card.shortReading, W - 140).forEach((line) => {
    ctx.fillText(line, W / 2, y);
    y += 32;
  });

  // Night reading
  y += 20;
  ctx.font = "italic 18px Georgia, Times New Roman, serif";
  ctx.fillStyle = "rgba(196, 202, 212, 0.6)";
  wrapText(ctx, card.nightReading, W - 160).forEach((line) => {
    ctx.fillText(line, W / 2, y);
    y += 28;
  });

  // Divider
  y += 20;
  drawDivider(ctx, W / 2, y, 50);
  y += 25;

  // Affirmation
  ctx.font = "italic 19px Georgia, Times New Roman, serif";
  ctx.fillStyle = "rgba(212, 194, 142, 0.55)";
  ctx.fillText(`\u201C${card.affirmation}\u201D`, W / 2, y);

  // Footer
  ctx.font = "13px Arial, sans-serif";
  ctx.fillStyle = "rgba(74, 78, 122, 0.6)";
  ctx.fillText("\u{1F319}  moonlightoracle.app", W / 2, H - 50);

  // Remove from hidden DOM position (caller will re-position for debug or export)
  canvas.remove();

  return canvas;
}

/** Draw text with manual letter spacing (centered) */
function drawSpacedText(ctx, text, cx, y, spacing) {
  const chars = text.split("");
  const totalWidth = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width + spacing, -spacing);
  let x = cx - totalWidth / 2;
  const saved = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((ch) => {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + spacing;
  });
  ctx.textAlign = saved;
}

/** Draw a centered horizontal gold line (not a gradient fillStyle — uses strokeStyle) */
function drawDivider(ctx, cx, y, halfWidth) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - halfWidth, y);
  ctx.lineTo(cx + halfWidth, y);
  const grad = ctx.createLinearGradient(cx - halfWidth, 0, cx + halfWidth, 0);
  grad.addColorStop(0, "rgba(212, 194, 142, 0)");
  grad.addColorStop(0.5, "rgba(212, 194, 142, 0.3)");
  grad.addColorStop(1, "rgba(212, 194, 142, 0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function shareOrDownload(canvas, fileName, fallbackText) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Failed to create image");

  const file = new File([blob], `${fileName}.png`, { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: fallbackText });
      return "shared";
    } catch (e) {
      if (e.name === "AbortError") return "cancelled";
    }
  }

  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return "copied";
  } catch {}

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.png`;
  a.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}

export default function ShareButton({ card, fileName = "moonlight-oracle", fallbackText = "" }) {
  const [status, setStatus] = useState("idle");

  const handleShare = useCallback(async () => {
    if (!card) return;
    setStatus("capturing");

    try {
      const canvas = drawShareCard(card);

      const result = await shareOrDownload(canvas, fileName, fallbackText);

      if (result === "shared" || result === "cancelled") {
        setStatus("idle");
      } else if (result === "copied") {
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("downloaded");
        setTimeout(() => setStatus("idle"), 2500);
      }
    } catch {
      setStatus("idle");
    }
  }, [card, fileName, fallbackText]);

  return (
    <button
      onClick={handleShare}
      disabled={status === "capturing"}
      className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-navy-light/60 border border-gold/15 text-gold/60 hover:text-gold/80 hover:border-gold/30 transition-all text-sm font-serif tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-wait"
    >
      {status === "capturing" && (
        <>
          <span className="animate-pulse">&#x2728;</span>
          Creating image...
        </>
      )}
      {status === "copied" && (
        <>
          <span>&#x2713;</span>
          Image copied
        </>
      )}
      {status === "downloaded" && (
        <>
          <span>&#x2713;</span>
          Image saved
        </>
      )}
      {status === "idle" && (
        <>
          <span>&#x2197;</span>
          Share this reading
        </>
      )}
    </button>
  );
}
