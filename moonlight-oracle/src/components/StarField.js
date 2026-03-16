"use client";

const STARS = [
  { top: "8%", left: "12%", duration: "3s", delay: "0s" },
  { top: "15%", left: "78%", duration: "4s", delay: "1s" },
  { top: "22%", left: "45%", duration: "3.5s", delay: "0.5s" },
  { top: "5%", left: "90%", duration: "5s", delay: "2s" },
  { top: "35%", left: "20%", duration: "4.5s", delay: "1.5s" },
  { top: "12%", left: "55%", duration: "3s", delay: "0.8s" },
  { top: "42%", left: "85%", duration: "4s", delay: "0.3s" },
  { top: "28%", left: "35%", duration: "5s", delay: "1.2s" },
  { top: "50%", left: "8%", duration: "3.5s", delay: "2.5s" },
  { top: "18%", left: "68%", duration: "4.5s", delay: "0.7s" },
  { top: "55%", left: "92%", duration: "3s", delay: "1.8s" },
  { top: "65%", left: "15%", duration: "4s", delay: "0.4s" },
  { top: "72%", left: "72%", duration: "5s", delay: "1.1s" },
  { top: "80%", left: "40%", duration: "3.5s", delay: "2.2s" },
  { top: "88%", left: "60%", duration: "4.5s", delay: "0.6s" },
  { top: "45%", left: "50%", duration: "3s", delay: "1.4s" },
];

export default function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {STARS.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            "--duration": star.duration,
            "--delay": star.delay,
          }}
        />
      ))}
    </div>
  );
}
