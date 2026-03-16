"use client";

import { useState, useEffect, useCallback } from "react";

const SETTINGS_KEY = "moonlight-oracle-settings";
const AMBIENT_KEY = "moonlight-oracle-ambient";
const DRAW_KEY = "moonlight-oracle-daily-draw";
const STREAK_KEY = "moonlight-oracle-streak";
const YESNO_KEY = "moonlight-oracle-yesno";

const SOUNDSCAPES = [
  { category: "Rain", tracks: [
    { id: "light-rain", name: "Light Rain" },
    { id: "rain-rooftop", name: "Rain on Rooftop" },
    { id: "rain-dripping", name: "Soft Dripping" },
    { id: "rain-interior", name: "Quiet Interior" },
  ]},
  { category: "Thunder", tracks: [
    { id: "distant-thunder", name: "Distant Thunder" },
    { id: "low-thunder", name: "Low Rolls" },
    { id: "summer-thunder", name: "Summer Storm" },
  ]},
  { category: "Nature", tracks: [
    { id: "forest-wind", name: "Forest Wind" },
    { id: "forest-bonfire", name: "Forest Bonfire" },
    { id: "fire", name: "Crackling Fire" },
  ]},
  { category: "Water", tracks: [
    { id: "beach", name: "Beach Ambience" },
    { id: "waves", name: "Waves on Rocks" },
    { id: "water-lapping", name: "Water & Wind" },
  ]},
  { category: "Ethereal", tracks: [
    { id: "space", name: "Space" },
    { id: "meditation", name: "432 Hz Meditation" },
  ]},
];

const ALL_TRACKS = SOUNDSCAPES.flatMap((s) => s.tracks);

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadAmbient() {
  try {
    const raw = localStorage.getItem(AMBIENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { trackId: null, playing: false, volume: 0.6 };
}

function saveAmbient(data) {
  localStorage.setItem(AMBIENT_KEY, JSON.stringify(data));
}

export default function SettingsPanel({ open, onClose }) {
  const [settings, setSettings] = useState({ reduceMotion: false });
  const [ambient, setAmbient] = useState({ trackId: null, playing: false, volume: 0.6 });
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Sync from localStorage when panel opens (legitimate external store read)
  useEffect(() => {
    if (!open) return;
    setSettings({ reduceMotion: false, ...loadSettings() }); // eslint-disable-line react-hooks/set-state-in-effect
    setAmbient(loadAmbient());
  }, [open]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);

      // Apply reduce-motion to <html> for CSS to read
      if (key === "reduceMotion") {
        document.documentElement.classList.toggle("reduce-motion", value);
      }

      return next;
    });
  }, []);

  const toggleAudio = useCallback(() => {
    setAmbient((prev) => {
      const next = { ...prev, playing: !prev.playing };
      saveAmbient(next);
      setTimeout(() => window.dispatchEvent(new Event("storage")), 0);
      return next;
    });
  }, []);

  const selectTrack = useCallback((trackId) => {
    setAmbient((prev) => {
      const next = { ...prev, trackId, playing: true };
      saveAmbient(next);
      setTimeout(() => window.dispatchEvent(new Event("storage")), 0);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    localStorage.removeItem(DRAW_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(YESNO_KEY);
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  }, [confirmReset]);

  // Apply reduce-motion on mount
  useEffect(() => {
    const s = loadSettings();
    if (s.reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-navy-dark/60 backdrop-blur-sm soundscape-backdrop-enter"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-xl mx-auto bg-navy-light/95 backdrop-blur-md border-t border-x border-indigo/20 rounded-t-2xl px-6 pt-6 pb-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-serif text-gold/80 tracking-wide">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-indigo/50 hover:text-silver/60 transition-colors text-sm cursor-pointer"
            >
              close
            </button>
          </div>

          <div className="flex flex-col gap-6 max-h-96 overflow-y-auto soundscape-scroll pr-1">

            {/* ── Audio ── */}
            <section>
              <p className="text-sm text-indigo/60 uppercase tracking-widest mb-3 font-serif">
                Ambient Audio
              </p>

              {/* On/Off toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-silver/70 text-sm font-serif">Sound</span>
                <button
                  onClick={toggleAudio}
                  className={`w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer relative ${ambient.playing ? "bg-gold/30" : "bg-indigo/20"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${ambient.playing ? "left-5.5 bg-gold" : "left-0.5 bg-indigo/60"}`}
                    style={{ left: ambient.playing ? "22px" : "2px" }}
                  />
                </button>
              </div>

              {/* Track selector */}
              <div className="flex flex-wrap gap-2">
                {SOUNDSCAPES.map((group) =>
                  group.tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(track.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-serif tracking-wide transition-all duration-200 cursor-pointer ${
                        ambient.trackId === track.id
                          ? "bg-gold/15 border border-gold/40 text-gold"
                          : "bg-navy/60 border border-indigo/15 text-silver/50 hover:border-indigo/30 hover:text-silver/70"
                      }`}
                    >
                      {track.name}
                    </button>
                  ))
                )}
              </div>
            </section>

            {/* ── Animations ── */}
            <section>
              <p className="text-sm text-indigo/60 uppercase tracking-widest mb-3 font-serif">
                Display
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-silver/70 text-sm font-serif">Reduce motion</span>
                  <p className="text-indigo/40 text-xs mt-0.5">Disables shooting stars, comets, and glow animations</p>
                </div>
                <button
                  onClick={() => updateSetting("reduceMotion", !settings.reduceMotion)}
                  className={`w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer relative flex-shrink-0 ${settings.reduceMotion ? "bg-gold/30" : "bg-indigo/20"}`}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                    style={{
                      left: settings.reduceMotion ? "22px" : "2px",
                      backgroundColor: settings.reduceMotion ? "#d4c28e" : "rgba(74, 78, 122, 0.6)",
                    }}
                  />
                </button>
              </div>
            </section>

            {/* ── Data ── */}
            <section>
              <p className="text-sm text-indigo/60 uppercase tracking-widest mb-3 font-serif">
                Data
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-silver/70 text-sm font-serif">Reset local data</span>
                  <p className="text-indigo/40 text-xs mt-0.5">Clears streaks, saved draws, and oracle history</p>
                </div>
                <button
                  onClick={handleReset}
                  className={`px-4 py-1.5 rounded-lg text-xs font-serif tracking-wide cursor-pointer transition-all duration-200 flex-shrink-0 ${
                    resetDone
                      ? "bg-gold/15 border border-gold/30 text-gold"
                      : confirmReset
                        ? "bg-red-900/30 border border-red-500/40 text-red-400"
                        : "bg-navy/60 border border-indigo/20 text-silver/50 hover:border-indigo/30 hover:text-silver/70"
                  }`}
                >
                  {resetDone ? "Done" : confirmReset ? "Confirm reset" : "Reset"}
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
