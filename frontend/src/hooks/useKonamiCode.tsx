"use client";

import { useEffect, useState, useCallback, useRef } from "react";



interface KonamiOptions {
 
  sequence?: string[];
 
  onActivate?: () => void;
}



const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function useKonamiCode({
  sequence = KONAMI_SEQUENCE,
  onActivate,
}: KonamiOptions = {}) {
  const [activated, setActivated] = useState(false);
  const indexRef = useRef(0);

  const reset = useCallback(() => {
    setActivated(false);
    indexRef.current = 0;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const expected = sequence[indexRef.current];
      const pressed = e.key;

      if (pressed === expected) {
        indexRef.current += 1;
        if (indexRef.current === sequence.length) {
          indexRef.current = 0;
          setActivated(true);
          onActivate?.();
        }
      } else {
       
        indexRef.current = pressed === sequence[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sequence, onActivate]);

  return { activated, reset };
}



interface KonamiOverlayProps {
  onClose: () => void;
}

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.2,
  size: 6 + Math.random() * 10,
  color: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#A29BFE", "#FD79A8", "#55EFC4"][
    Math.floor(Math.random() * 6)
  ],
  drift: (Math.random() - 0.5) * 120,
  spin: Math.random() * 720 - 360,
  shape: Math.random() > 0.5 ? "circle" : "rect",
}));

export function KonamiOverlay({ onClose }: KonamiOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        @keyframes konami-fall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
        }
        @keyframes konami-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        @keyframes konami-flicker {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        @keyframes konami-scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes konami-glitch {
          0%   { clip-path: inset(0 0 100% 0); transform: translate(0); }
          10%  { clip-path: inset(10% 0 60% 0); transform: translate(-4px, 2px); }
          20%  { clip-path: inset(40% 0 30% 0); transform: translate(4px, -2px); }
          30%  { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 0); }
          40%  { clip-path: inset(0 0 0 0);     transform: translate(0); }
          100% { clip-path: inset(0 0 0 0);     transform: translate(0); }
        }
        @keyframes konami-appear {
          0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes konami-key-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }

        .konami-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0, 0, 0, 0);
          transition: background 0.35s ease;
          font-family: 'Press Start 2P', monospace;
        }
        .konami-overlay.visible {
          background: rgba(0, 0, 0, 0.88);
        }
        .konami-card {
          position: relative;
          background: #0a0a0f;
          border: 2px solid #333;
          border-radius: 4px;
          padding: 48px 56px;
          max-width: 560px;
          width: 90%;
          text-align: center;
          opacity: 0;
          box-shadow: 0 0 0 1px #222, 0 0 60px rgba(78, 205, 196, 0.15);
          overflow: hidden;
        }
        .konami-card.visible {
          animation: konami-appear 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .konami-scanline-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(78,205,196,0.6), transparent);
          animation: konami-scanline 3s linear infinite;
          pointer-events: none;
        }
        .konami-badge {
          display: inline-block;
          font-size: 9px;
          letter-spacing: 3px;
          color: #4ECDC4;
          border: 1px solid #4ECDC4;
          padding: 4px 10px;
          margin-bottom: 24px;
          animation: konami-flicker 2.4s ease-in-out infinite;
        }
        .konami-title {
          font-size: clamp(18px, 4vw, 26px);
          color: #FFE66D;
          line-height: 1.5;
          margin-bottom: 16px;
          animation: konami-pulse 2s ease-in-out infinite;
        }
        .konami-sub {
          font-size: 8px;
          color: #888;
          letter-spacing: 1px;
          line-height: 2;
          margin-bottom: 36px;
        }
        .konami-keys {
          display: flex; gap: 6px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 36px;
        }
        .konami-key {
          background: #1a1a2e;
          border: 1px solid #4ECDC4;
          color: #4ECDC4;
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          padding: 6px 8px;
          border-radius: 3px;
          opacity: 0;
        }
        .konami-btn {
          background: transparent;
          border: 1px solid #FF6B6B;
          color: #FF6B6B;
          font-family: 'Press Start 2P', monospace;
          font-size: 9px;
          padding: 12px 24px;
          cursor: pointer;
          letter-spacing: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .konami-btn:hover {
          background: #FF6B6B;
          color: #0a0a0f;
        }
        .konami-particle {
          position: fixed;
          top: -20px;
          border-radius: 2px;
          pointer-events: none;
          animation: konami-fall linear forwards;
        }
        .konami-hint {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          color: #444;
          letter-spacing: 1px;
          pointer-events: none;
          transition: opacity 0.3s;
        }
      `}</style>

     
      {visible &&
        PARTICLES.map((p) => (
          <div
            key={p.id}
            className="konami-particle"
            style={{
              left: `${p.x}%`,
              width: p.shape === "circle" ? p.size : p.size * 0.7,
              height: p.size,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              background: p.color,
              animationDuration: `${2.4 + Math.random() * 2}s`,
              animationDelay: `${p.delay}s`,
              ["--drift" as string]: `${p.drift}px`,
              ["--spin" as string]: `${p.spin}deg`,
            }}
          />
        ))}

      <div
        className={`konami-overlay${visible ? " visible" : ""}`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className={`konami-card${visible ? " visible" : ""}`}>
          <div className="konami-scanline-bar" />

          <div className="konami-badge">EASTER EGG DESBLOQUEADO</div>

          <div className="konami-title">
            ↑↑↓↓←→←→BA
          </div>

          <div className="konami-sub">
            VOCÊ CONHECE O CÓDIGO.<br />
            PARABÉNS, VERDADEIRO GAMER.
          </div>

          <div className="konami-keys">
            {["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"].map(
              (key, i) => (
                <span
                  key={i}
                  className="konami-key"
                  style={{
                    animation: visible
                      ? `konami-key-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + i * 0.07}s forwards`
                      : "none",
                  }}
                >
                  {key}
                </span>
              )
            )}
          </div>

          <button className="konami-btn" onClick={handleClose}>
            [ CONTINUAR ]
          </button>
        </div>
      </div>

      <div className="konami-hint" style={{ opacity: visible ? 1 : 0 }}>
        ESC para fechar
      </div>
    </>
  );
}


export function KonamiCode() {
  const { activated, reset } = useKonamiCode();

  if (!activated) return null;
  return <KonamiOverlay onClose={reset} />;
}