import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ═══ PIXEL CAT (INTEGRATED RUNNING MASCOT) ═══ */
const PixelCat = ({ onClick, innerRef, style }) => (
  <div 
    className="pixel-cat pixel-cat-running" 
    onClick={onClick} 
    ref={innerRef} 
    style={style}
    title="Play Retro Cat Game"
    aria-label="Play Retro Cat Game"
  >
    <svg viewBox="0 0 16 16" width="28" height="28" fill="currentColor">
      <g className="cat-frame-1">
        <rect x="10" y="4" width="1" height="1" />
        <rect x="13" y="4" width="1" height="1" />
        <rect x="10" y="5" width="4" height="3" />
        <rect x="3" y="6" width="7" height="3" />
        <rect x="2" y="5" width="1" height="2" />
        <rect x="4" y="9" width="1" height="2" />
        <rect x="8" y="9" width="1" height="2" />
        <rect x="11" y="8" width="1" height="2" />
      </g>
      <g className="cat-frame-2">
        <rect x="10" y="5" width="1" height="1" />
        <rect x="13" y="5" width="1" height="1" />
        <rect x="10" y="6" width="4" height="3" />
        <rect x="3" y="7" width="7" height="3" />
        <rect x="1" y="6" width="2" height="1" />
        <rect x="5" y="10" width="1" height="2" />
        <rect x="7" y="10" width="1" height="2" />
        <rect x="12" y="9" width="1" height="2" />
      </g>
    </svg>
  </div>
);
/* ═══ SECTION PROGRESS DOTS ═══ */
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'journey', label: 'Journey' },
  { id: 'stats', label: 'Stats' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
];

function SectionDots({ scrollTo }) {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const triggers = SECTIONS.map(s => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(s.id),
        onEnterBack: () => setActive(s.id),
      });
    }).filter(Boolean);
    return () => triggers.forEach(t => t.kill());
  }, []);

  return (
    <div className="section-dots">
      {SECTIONS.map(s => (
        <button
          key={s.id}
          className={`section-dot${active === s.id ? ' active' : ''}`}
          data-label={s.label}
          onClick={() => scrollTo(s.id)}
          aria-label={`Navigate to ${s.label}`}
        />
      ))}
    </div>
  );
}
export { PixelCat, SectionDots };