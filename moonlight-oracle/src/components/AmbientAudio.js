"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "moonlight-oracle-ambient";

const SOUNDSCAPES = [
  {
    category: "Rain",
    tracks: [
      { id: "light-rain", name: "Light Rain", file: "/audio/light-rain.mp3" },
      { id: "rain-rooftop", name: "Rain on Rooftop", file: "/audio/rain-on-rooftop.mp3" },
      { id: "rain-dripping", name: "Soft Dripping", file: "/audio/rain-dripping-softly.mp3" },
      { id: "rain-interior", name: "Quiet Interior", file: "/audio/rain-quiet-interior.mp3" },
    ],
  },
  {
    category: "Thunder",
    tracks: [
      { id: "distant-thunder", name: "Distant Thunder", file: "/audio/distant-thunder.mp3" },
      { id: "low-thunder", name: "Low Rolls", file: "/audio/low-thunder-rolls.mp3" },
      { id: "summer-thunder", name: "Summer Storm", file: "/audio/summer-thunder-rain.mp3" },
    ],
  },
  {
    category: "Nature",
    tracks: [
      { id: "forest-wind", name: "Forest Wind", file: "/audio/forest-wind.mp3" },
      { id: "forest-bonfire", name: "Forest Bonfire", file: "/audio/forest-bonfire.mp3" },
      { id: "fire", name: "Crackling Fire", file: "/audio/fire.mp3" },
    ],
  },
  {
    category: "Water",
    tracks: [
      { id: "beach", name: "Beach Ambience", file: "/audio/beach-ambience.mp3" },
      { id: "waves", name: "Waves on Rocks", file: "/audio/waves-crashing.mp3" },
      { id: "water-lapping", name: "Water & Wind", file: "/audio/water-lapping.mp3" },
    ],
  },
  {
    category: "Ethereal",
    tracks: [
      { id: "space", name: "Space", file: "/audio/space-asmr.mp3" },
      { id: "meditation", name: "432 Hz Meditation", file: "/audio/meditation-432hz.mp3" },
    ],
  },
];

const ALL_TRACKS = SOUNDSCAPES.flatMap((s) => s.tracks);

const CATEGORY_ICONS = {
  Rain: "\u{1F327}\u{FE0F}",
  Thunder: "\u{26C8}\u{FE0F}",
  Nature: "\u{1F343}",
  Water: "\u{1F30A}",
  Ethereal: "\u{2728}",
};

const CROSSFADE_MS = 1500;

export default function AmbientAudio() {
  const currentRef = useRef(null);
  const nextRef = useRef(null);
  const fadeInterval = useRef(null);

  const [activeTrack, setActiveTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Load saved preference
  useEffect(() => {
    function loadFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.trackId) {
            const found = ALL_TRACKS.find((t) => t.id === saved.trackId);
            if (found) setActiveTrack(found);
            setPlaying(!!saved.playing);
          } else {
            setPlaying(false);
          }
          if (typeof saved.volume === "number") setVolume(saved.volume);
        }
      } catch {}
      setReady(true);
    }

    loadFromStorage();

    // Re-read when settings panel dispatches a storage event
    window.addEventListener("storage", loadFromStorage);
    return () => window.removeEventListener("storage", loadFromStorage);
  }, []);

  // Persist preference
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ trackId: activeTrack?.id || null, playing, volume })
    );
  }, [activeTrack, playing, volume, ready]);

  // Apply volume to audio element
  useEffect(() => {
    if (currentRef.current) currentRef.current.volume = volume;
  }, [volume]);

  // Play / pause current track
  useEffect(() => {
    const audio = currentRef.current;
    if (!audio || !ready) return;

    if (playing && activeTrack) {
      if (audio.src !== window.location.origin + activeTrack.file) {
        audio.src = activeTrack.file;
      }
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing, activeTrack, ready]);

  const crossfadeTo = useCallback(
    (track) => {
      if (!currentRef.current) return;

      if (!playing || !activeTrack) {
        setActiveTrack(track);
        setPlaying(true);
        return;
      }

      const outAudio = currentRef.current;
      const inAudio = nextRef.current;
      if (!inAudio) return;

      inAudio.src = track.file;
      inAudio.volume = 0;
      inAudio.loop = true;
      inAudio.play().catch(() => {});

      const steps = 30;
      const stepMs = CROSSFADE_MS / steps;
      let step = 0;

      clearInterval(fadeInterval.current);
      fadeInterval.current = setInterval(() => {
        step++;
        const progress = step / steps;
        outAudio.volume = Math.max(0, volume * (1 - progress));
        inAudio.volume = Math.min(volume, volume * progress);

        if (step >= steps) {
          clearInterval(fadeInterval.current);
          outAudio.pause();
          outAudio.volume = volume;
          outAudio.src = track.file;
          inAudio.pause();
          inAudio.volume = 0;
          outAudio.play().catch(() => {});
          setActiveTrack(track);
        }
      }, stepMs);
    },
    [playing, activeTrack, volume]
  );

  const handleTrackClick = useCallback(
    (track) => {
      if (activeTrack?.id === track.id) {
        setPlaying((p) => !p);
      } else {
        crossfadeTo(track);
      }
    },
    [activeTrack, crossfadeTo]
  );

  const handleToggle = useCallback(() => {
    if (!activeTrack) {
      setOpen(true);
      return;
    }
    setPlaying((p) => !p);
  }, [activeTrack]);

  const handleVolumeChange = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (currentRef.current) currentRef.current.volume = v;
  }, []);

  if (!ready) return null;

  return (
    <>
      <audio ref={currentRef} loop preload="none" />
      <audio ref={nextRef} loop preload="none" />

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-dark/60 backdrop-blur-sm soundscape-backdrop-enter"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Soundscape tray */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-xl mx-auto bg-navy-light/95 backdrop-blur-md border-t border-x border-indigo/20 rounded-t-2xl px-6 pt-6 pb-7 shadow-2xl">
          {/* Tray header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-serif text-gold/80 tracking-wide">
              Soundscapes
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-indigo/50 hover:text-silver/60 transition-colors text-sm cursor-pointer"
            >
              close
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-3 mb-6 px-1">
            <span className="text-indigo/50 text-sm">&#x1F509;</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider flex-1"
            />
            <span className="text-indigo/50 text-sm">&#x1F50A;</span>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-5 max-h-80 overflow-y-auto soundscape-scroll pr-1">
            {SOUNDSCAPES.map((group) => (
              <div key={group.category}>
                <p className="text-sm text-indigo/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>{CATEGORY_ICONS[group.category]}</span>
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {group.tracks.map((track) => {
                    const isActive = activeTrack?.id === track.id;
                    const isPlaying = isActive && playing;
                    return (
                      <button
                        key={track.id}
                        onClick={() => handleTrackClick(track)}
                        className={`
                          px-4 py-2.5 rounded-lg text-sm font-serif tracking-wide
                          transition-all duration-300 cursor-pointer
                          ${isPlaying
                            ? "bg-gold/15 border border-gold/40 text-gold soundscape-active"
                            : isActive
                              ? "bg-indigo/15 border border-indigo/30 text-silver/70"
                              : "bg-navy/60 border border-indigo/15 text-silver/50 hover:border-indigo/30 hover:text-silver/70"
                          }
                        `}
                      >
                        {isPlaying && (
                          <span className="inline-block mr-1.5 soundscape-bars">
                            <span className="soundscape-bar" />
                            <span className="soundscape-bar" />
                            <span className="soundscape-bar" />
                          </span>
                        )}
                        {track.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating toggle button */}
      <button
        onClick={playing ? handleToggle : () => setOpen(true)}
        onContextMenu={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        aria-label={playing ? "Pause ambient sound" : "Play ambient sound"}
        className={`
          fixed bottom-6 right-6 z-50 h-12 rounded-full
          bg-navy-light/90 backdrop-blur-sm
          flex items-center gap-2.5
          transition-all duration-300 cursor-pointer
          ${playing
            ? "border border-gold/30 pl-3.5 pr-4 soundscape-btn-glow"
            : "border border-indigo/30 hover:border-indigo/50 px-3.5"
          }
          ${open ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        {playing ? (
          <>
            <span className="soundscape-bars">
              <span className="soundscape-bar" />
              <span className="soundscape-bar" />
              <span className="soundscape-bar" />
            </span>
            <span className="text-gold/70 text-sm font-serif tracking-wide max-w-28 truncate">
              {activeTrack?.name}
            </span>
            <span
              className="text-indigo/50 hover:text-silver/60 text-sm ml-0.5 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
            >
              &#x25B4;
            </span>
          </>
        ) : (
          <span className="text-indigo/50 text-base">&#x266B;</span>
        )}
      </button>
    </>
  );
}
