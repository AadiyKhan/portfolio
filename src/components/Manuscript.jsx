import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ═══ 3D SCROLL-DRIVEN NOTEBOOK ═══ */

// Minimal SVG illustrations per page
const PAGE_ILLUSTRATIONS = [
  // 2023 — A simple monitor/laptop
  <svg key="0" viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="40" y="20" width="120" height="80" rx="6"/>
    <line x1="40" y1="90" x2="160" y2="90"/>
    <line x1="85" y1="110" x2="115" y2="110"/>
    <line x1="75" y1="110" x2="125" y2="110"/>
    <rect x="55" y="32" width="90" height="48" rx="2" strokeOpacity="0.4"/>
    <line x1="65" y1="44" x2="105" y2="44" strokeOpacity="0.5"/>
    <line x1="65" y1="52" x2="120" y2="52" strokeOpacity="0.5"/>
    <line x1="65" y1="60" x2="95" y2="60" strokeOpacity="0.5"/>
    <circle cx="100" cy="100" r="2" fill="currentColor" strokeWidth="0"/>
  </svg>,
  // 2024 — Eye + neural connections (computer vision)
  <svg key="1" viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <ellipse cx="100" cy="60" rx="60" ry="30"/>
    <circle cx="100" cy="60" r="15"/>
    <circle cx="100" cy="60" r="6" fill="currentColor" fillOpacity="0.15" strokeWidth="0"/>
    <circle cx="100" cy="60" r="3" fill="currentColor" strokeWidth="0"/>
    <line x1="50" y1="100" x2="100" y2="75" strokeOpacity="0.4"/>
    <line x1="100" y1="75" x2="150" y2="100" strokeOpacity="0.4"/>
    <circle cx="50" cy="105" r="5" strokeOpacity="0.6"/>
    <circle cx="150" cy="105" r="5" strokeOpacity="0.6"/>
    <circle cx="100" cy="110" r="5" strokeOpacity="0.6"/>
  </svg>,
  // 2025 — Transformer architecture blocks
  <svg key="2" viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="20" y="50" width="40" height="40" rx="4"/>
    <rect x="80" y="25" width="40" height="40" rx="4"/>
    <rect x="80" y="75" width="40" height="40" rx="4"/>
    <rect x="140" y="50" width="40" height="40" rx="4"/>
    <line x1="60" y1="70" x2="80" y2="45" strokeOpacity="0.5"/>
    <line x1="60" y1="70" x2="80" y2="95" strokeOpacity="0.5"/>
    <line x1="120" y1="45" x2="140" y2="70" strokeOpacity="0.5"/>
    <line x1="120" y1="95" x2="140" y2="70" strokeOpacity="0.5"/>
    <text x="95" y="50" fontSize="8" strokeWidth="0.5" textAnchor="middle" dominantBaseline="middle">Attn</text>
    <text x="95" y="100" fontSize="8" strokeWidth="0.5" textAnchor="middle" dominantBaseline="middle">FFN</text>
  </svg>,
  // 2026 — Shield / defence badge
  <svg key="3" viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M100 20 L150 40 L150 85 Q150 120 100 130 Q50 120 50 85 L50 40 Z"/>
    <path d="M100 35 L135 50 L135 80 Q135 108 100 118 Q65 108 65 80 L65 50 Z" strokeOpacity="0.4"/>
    <polyline points="82,72 95,85 120,60" strokeWidth="2.5"/>
  </svg>,
  // 2027 — Rocket / arrow up
  <svg key="4" viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M100 15 C115 25 130 55 130 80 L100 95 L70 80 C70 55 85 25 100 15Z"/>
    <circle cx="100" cy="58" r="10"/>
    <path d="M75 95 L65 115 L80 110 L100 125 L120 110 L135 115 L125 95" strokeOpacity="0.5"/>
    <line x1="100" y1="125" x2="100" y2="135" strokeOpacity="0.4"/>
  </svg>,
];

/* ═══ 3D FULL-PAGE SCROLL-DRIVEN CAMERA MANUSCRIPT ═══ */

const MANUSCRIPT_ENTRIES = [
  {
    year: '2023',
    chapter: '01',
    title: 'Started B.Tech CS @ VIT Bhopal',
    subtitle: 'THE BEGINNING',
    desc: 'First lines of Python, first "hello world," and the first all-nighter. Discovered a deep passion for understanding the mathematical foundations behind code.',
    badge: 'FIRST PRINCIPLES',
    svg: (
      <svg viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="20" y="15" width="120" height="70" rx="4" strokeOpacity="0.8"/>
        <line x1="20" y1="72" x2="140" y2="72" strokeOpacity="0.3"/>
        <line x1="32" y1="30" x2="80" y2="30" stroke="var(--accent)" strokeWidth="2"/>
        <line x1="32" y1="42" x2="110" y2="42" strokeOpacity="0.5"/>
        <line x1="32" y1="52" x2="95" y2="52" strokeOpacity="0.5"/>
        <circle cx="125" cy="30" r="4" fill="var(--accent)" strokeWidth="0"/>
      </svg>
    )
  },
  {
    year: '2024',
    chapter: '02',
    title: 'OpenCV & Computer Vision',
    subtitle: 'INTELLIGENT PERCEPTION',
    desc: 'Built early computer vision systems & anomaly detection models. Trained Autoencoders on 2.5M+ records, obsessing over real-time latency and feature extraction.',
    badge: '2.5M+ RECORDS',
    svg: (
      <svg viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <ellipse cx="80" cy="50" rx="50" ry="25" stroke="var(--accent)"/>
        <circle cx="80" cy="50" r="14" stroke="var(--accent)"/>
        <circle cx="80" cy="50" r="5" fill="var(--accent)" strokeWidth="0"/>
        <line x1="30" y1="85" x2="80" y2="65" strokeOpacity="0.4"/>
        <line x1="80" y1="65" x2="130" y2="85" strokeOpacity="0.4"/>
        <circle cx="30" cy="85" r="3" fill="currentColor" strokeWidth="0"/>
        <circle cx="130" cy="85" r="3" fill="currentColor" strokeWidth="0"/>
      </svg>
    )
  },
  {
    year: '2025',
    chapter: '03',
    title: 'Transformers & FlowBERT',
    subtitle: 'NEURAL ARCHITECTURES',
    desc: 'Reimplemented Attention Is All You Need from scratch without high-level libraries. Multi-task fine-tuned DistilBERT cutting manual ticket triage effort by 75%.',
    badge: '75% TRIAGE CUT',
    svg: (
      <svg viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="15" y="35" width="35" height="30" rx="3" stroke="var(--accent)"/>
        <rect x="62" y="15" width="36" height="30" rx="3"/>
        <rect x="62" y="55" width="36" height="30" rx="3"/>
        <rect x="110" y="35" width="35" height="30" rx="3" stroke="var(--accent)"/>
        <line x1="50" y1="50" x2="62" y2="30" strokeOpacity="0.5"/>
        <line x1="50" y1="50" x2="62" y2="70" strokeOpacity="0.5"/>
        <line x1="98" y1="30" x2="110" y2="50" strokeOpacity="0.5"/>
        <line x1="98" y1="70" x2="110" y2="50" strokeOpacity="0.5"/>
      </svg>
    )
  },
  {
    year: '2026',
    chapter: '04',
    title: 'Ministry of Defence Internship',
    subtitle: 'INDUSTRIAL AI IN PRODUCTION',
    desc: 'Selected for AI-driven textile defect detection at Ordnance Clothing Factory (OCF) Shahjahanpur. Architected live manufacturing line QA models for defense production.',
    badge: 'DEFENCE AI INTERN',
    svg: (
      <svg viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M80 15 L120 30 L120 65 Q120 90 80 98 Q40 90 40 65 L40 30 Z" stroke="var(--accent)"/>
        <path d="M80 28 L108 38 L108 62 Q108 80 80 86 Q52 80 52 62 L52 38 Z" strokeOpacity="0.4"/>
        <polyline points="66,55 76,65 96,45" stroke="var(--accent)" strokeWidth="2"/>
      </svg>
    )
  },
  {
    year: '2027',
    chapter: '05',
    title: 'Next: AI Engineer',
    subtitle: 'BUILDING AT SCALE',
    desc: 'Graduating CS & targeting high-impact ML Engineering / Research roles. Building robust, scalable machine learning systems with clean architecture.',
    badge: 'FULL-TIME READY',
    svg: (
      <svg viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M80 12 C92 20 104 45 104 65 L80 78 L56 65 C56 45 68 20 80 12Z" stroke="var(--accent)"/>
        <circle cx="80" cy="46" r="8" stroke="var(--accent)"/>
        <path d="M60 78 L52 92 L64 88 L80 98 L96 88 L108 92 L100 78" strokeOpacity="0.5"/>
      </svg>
    )
  }
];

function Timeline({ data }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const pathRef = useRef(null);
  const headRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const path = pathRef.current;
    const head = headRef.current;
    if (!section || !canvas) return;

    let pathLength = 0;
    if (path) {
      pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });
      if (head) {
        const startPt = path.getPointAtLength(0);
        head.setAttribute('cx', startPt.x);
        head.setAttribute('cy', startPt.y);
      }
    }

    // High-performance manuscript camera sequence mapped across 2500vh scroll runway
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=2500vh',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          let step = 0;
          if (self.progress < (3.0 / 12.0)) step = 0;
          else if (self.progress < (5.0 / 12.0)) step = 1;
          else if (self.progress < (7.0 / 12.0)) step = 2;
          else if (self.progress < (9.0 / 12.0)) step = 3;
          else step = 4;
          setActiveStep(step);

          // Real-time Tour Guide Head Marker Tracking
          if (path && head) {
            // Path drawing happens between 1.0 and 11.0 seconds on the 12-second timeline
            const drawProgress = Math.max(0, Math.min(1, (self.progress * 12.0 - 1.0) / 10.0));
            const pt = path.getPointAtLength(drawProgress * pathLength);
            head.setAttribute('cx', pt.x);
            head.setAttribute('cy', pt.y);
          }
        }
      }
    });

    // Continuous, unbroken drawing of the freehand ink line across scroll runway
    if (path) {
      tl.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 10.0
      }, 1.0); // Starts after the 2D hold
    }

    // Hold perfectly flat 2D state at the very beginning
    tl.to(canvas, { scale: 1.0, xPercent: 0, yPercent: 0, rotateZ: 0, rotateX: 0, rotateY: 0, duration: 1.0 }, 0)

    // Chapter 01 (2023 - Top Left)
      .to(canvas, { scale: 1.28, xPercent: 22, yPercent: 20, rotateZ: -1, rotateX: -8, rotateY: 4, ease: 'power2.inOut', duration: 1.0 }, 1.0)
      .to(canvas, { scale: 1.28, xPercent: 22, yPercent: 20, rotateZ: -1, rotateX: -8, rotateY: 4, ease: 'none', duration: 1.0 }, 2.0)

    // Chapter 02 (2024 - Bottom Left)
      .to(canvas, { scale: 1.28, xPercent: 22, yPercent: -20, rotateZ: 1, rotateX: -10, rotateY: 3, ease: 'power2.inOut', duration: 1.0 }, 3.0)
      .to(canvas, { scale: 1.28, xPercent: 22, yPercent: -20, rotateZ: 1, rotateX: -10, rotateY: 3, ease: 'none', duration: 1.0 }, 4.0)

    // Chapter 03 (2025 - Top Right)
      .to(canvas, { scale: 1.28, xPercent: -22, yPercent: 22, rotateZ: -1, rotateX: -8, rotateY: -4, ease: 'power2.inOut', duration: 1.0 }, 5.0)
      .to(canvas, { scale: 1.28, xPercent: -22, yPercent: 22, rotateZ: -1, rotateX: -8, rotateY: -4, ease: 'none', duration: 1.0 }, 6.0)

    // Chapter 04 (2026 - Middle Right)
      .to(canvas, { scale: 1.28, xPercent: -22, yPercent: 0, rotateZ: 1, rotateX: -10, rotateY: -3, ease: 'power2.inOut', duration: 1.0 }, 7.0)
      .to(canvas, { scale: 1.28, xPercent: -22, yPercent: 0, rotateZ: 1, rotateX: -10, rotateY: -3, ease: 'none', duration: 1.0 }, 8.0)

    // Chapter 05 (2027 - Bottom Right)
      .to(canvas, { scale: 1.28, xPercent: -22, yPercent: -22, rotateZ: -0.5, rotateX: -12, rotateY: -2, ease: 'power2.inOut', duration: 1.0 }, 9.0)
      .to(canvas, { scale: 1.28, xPercent: -22, yPercent: -22, rotateZ: -0.5, rotateX: -12, rotateY: -2, ease: 'none', duration: 1.0 }, 10.0)

    // Pull back smoothly to a perfectly flat 2D overview revealing the complete manuscript spread!
      .to(canvas, { scale: 1.0, xPercent: 0, yPercent: 0, rotateZ: 0, rotateX: 0, rotateY: 0, ease: 'power2.inOut', duration: 1.0 }, 11.0);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.revert();
      tl.revert();
      tl.kill();
    };
  }, { scope: sectionRef });

  return (
    <section className="manuscript-section" id="journey" ref={sectionRef}>
      {/* HUD Header Bar */}
      <div className="manuscript-hud">
        <div className="hud-badge">
          <span className="hud-dot" /> 04 — JOURNEY MANUSCRIPT
        </div>
        <div className="hud-chapters">
          {MANUSCRIPT_ENTRIES.map((item, idx) => (
            <div 
              key={idx} 
              className={`hud-chip ${activeStep === idx ? 'active' : ''}`}
            >
              <span className="hud-year">{item.year}</span>
              <span className="hud-title-mini">{item.subtitle}</span>
            </div>
          ))}
        </div>
        <div className="hud-hint">
          <span>SCROLL TO EXPLORE MANUSCRIPT</span> ↓
        </div>
      </div>

      {/* 3D Camera Scene */}
      <div className="manuscript-scene">
        {/* The Fullpage Open Manuscript Canvas */}
        <div className="manuscript-canvas" ref={canvasRef}>
          <div className="manuscript-book">
            {/* Dynamic Freehand Organic Ink Path overlaying the notebook spread */}
            <svg 
              className="manuscript-ink-svg" 
              viewBox="0 0 1400 850" 
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 25,
                pointerEvents: 'none',
                overflow: 'visible'
              }}
            >
              <path
                ref={pathRef}
                d="M 320 170 C 450 280, 180 430, 320 550 C 500 750, 800 50, 1080 135 C 1250 220, 920 300, 1080 375 C 1220 460, 940 540, 1080 615"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="320" cy="170" r="5" fill="var(--accent)" />
              <circle cx="320" cy="550" r="5" fill="var(--accent)" />
              <circle cx="1080" cy="135" r="5" fill="var(--accent)" />
              <circle cx="1080" cy="375" r="5" fill="var(--accent)" />
              <circle cx="1080" cy="615" r="5" fill="var(--accent)" />

              {/* Glowing Line-Tracking Tour Guide Marker Head */}
              <circle 
                ref={headRef} 
                cx="320" 
                cy="170" 
                r="7" 
                fill="#ffffff" 
                stroke="var(--accent)" 
                strokeWidth="3.5"
              />
            </svg>

            {/* Book Spine */}
            <div className="mb-spine">
              <span className="mb-spine-text">AADIY KHAN // RESEARCH & LOG</span>
            </div>

            {/* LEFT PAGE */}
            <div className="mb-page mb-page-left">
              <div className="mb-paper-lines" />
              <div className="mb-watermark">2023—2024</div>
              
              {/* ENTRY 2023 (Top Left) */}
              <div className={`mb-entry entry-2023 ${activeStep === 0 ? 'focused' : ''}`}>
                <div className="entry-head">
                  <span className="entry-num">CH.01</span>
                  <span className="entry-year">{MANUSCRIPT_ENTRIES[0].year}</span>
                  <span className="entry-pill">{MANUSCRIPT_ENTRIES[0].badge}</span>
                </div>
                <h3 className="entry-title">{MANUSCRIPT_ENTRIES[0].title}</h3>
                <p className="entry-desc">{MANUSCRIPT_ENTRIES[0].desc}</p>
                <div className="entry-svg">{MANUSCRIPT_ENTRIES[0].svg}</div>
                <div className="entry-stamp">VERIFIED // VIT BHOPAL</div>
              </div>

              {/* ENTRY 2024 (Bottom Left) */}
              <div className={`mb-entry entry-2024 ${activeStep === 1 ? 'focused' : ''}`}>
                <div className="entry-head">
                  <span className="entry-num">CH.02</span>
                  <span className="entry-year">{MANUSCRIPT_ENTRIES[1].year}</span>
                  <span className="entry-pill">{MANUSCRIPT_ENTRIES[1].badge}</span>
                </div>
                <h3 className="entry-title">{MANUSCRIPT_ENTRIES[1].title}</h3>
                <p className="entry-desc">{MANUSCRIPT_ENTRIES[1].desc}</p>
                <div className="entry-svg">{MANUSCRIPT_ENTRIES[1].svg}</div>
                <div className="entry-margin-note">→ Real-time Autoencoder latency &lt; 5ms</div>
              </div>
            </div>

            {/* RIGHT PAGE */}
            <div className="mb-page mb-page-right">
              <div className="mb-paper-lines" />
              <div className="mb-margin-red" />
              <div className="mb-coffee-stain" />

              {/* ENTRY 2025 (Top Right) */}
              <div className={`mb-entry entry-2025 ${activeStep === 2 ? 'focused' : ''}`}>
                <div className="entry-head">
                  <span className="entry-num">CH.03</span>
                  <span className="entry-year">{MANUSCRIPT_ENTRIES[2].year}</span>
                  <span className="entry-pill">{MANUSCRIPT_ENTRIES[2].badge}</span>
                </div>
                <h3 className="entry-title">{MANUSCRIPT_ENTRIES[2].title}</h3>
                <p className="entry-desc">{MANUSCRIPT_ENTRIES[2].desc}</p>
                <div className="entry-svg">{MANUSCRIPT_ENTRIES[2].svg}</div>
                <div className="entry-sticky">
                  <span>★ Self-Attention from scratch</span>
                </div>
              </div>

              {/* ENTRY 2026 (Bottom Right) */}
              <div className={`mb-entry entry-2026 ${activeStep === 3 ? 'focused' : ''}`}>
                <div className="entry-head">
                  <span className="entry-num">CH.04</span>
                  <span className="entry-year">{MANUSCRIPT_ENTRIES[3].year}</span>
                  <span className="entry-pill">{MANUSCRIPT_ENTRIES[3].badge}</span>
                </div>
                <h3 className="entry-title">{MANUSCRIPT_ENTRIES[3].title}</h3>
                <p className="entry-desc">{MANUSCRIPT_ENTRIES[3].desc}</p>
                <div className="entry-svg">{MANUSCRIPT_ENTRIES[3].svg}</div>
                <div className="entry-stamp defence">MINISTRY OF DEFENCE // QA AI</div>
              </div>

              {/* ENTRY 2027 / FOOTNOTE (Center Bottom Summary) */}
              <div className={`mb-entry entry-2027 ${activeStep === 4 ? 'focused' : ''}`}>
                <div className="entry-head">
                  <span className="entry-num">CH.05</span>
                  <span className="entry-year">{MANUSCRIPT_ENTRIES[4].year}</span>
                  <span className="entry-pill">{MANUSCRIPT_ENTRIES[4].badge}</span>
                </div>
                <h3 className="entry-title">{MANUSCRIPT_ENTRIES[4].title}</h3>
                <p className="entry-desc">{MANUSCRIPT_ENTRIES[4].desc}</p>
                <div className="entry-signature">
                  <span>Aadiy Khan</span>
                  <p>Building intelligence from first principles.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
export default Timeline;