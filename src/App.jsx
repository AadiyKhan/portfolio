import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { GitHubCalendar } from 'react-github-calendar';

import portfolioData from '../data/portfolio.json';
import DinoGame from './components/DinoGame';
import ShootingStars from './components/ShootingStars';
import './index.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SKILLS = [
  'PyTorch', '◆', 'TensorFlow', '◆', 'Transformers', '◆', 'Computer Vision', '◆',
  'NLP', '◆', 'Docker', '◆', 'Kafka', '◆', 'Python', '◆', 'React', '◆',
  'Node.js', '◆', 'Git', '◆', 'Linux', '◆', 'MLOps', '◆', 'Deep Learning', '◆',
  'GANs', '◆', 'BERT', '◆', 'OpenCV', '◆', 'Scikit-learn', '◆',
];

import imgTransformer from './assets/images/transformer_pixel.png';
import imgNads from './assets/images/nads_pixel.png';
import imgFlowbert from './assets/images/flowbert_pixel.png';

const PROJECT_IMAGES = {
  'Transformer From Scratch': imgTransformer,
  'NADS — Anomaly Detection': imgNads,
  'FlowBERT': imgFlowbert,
};

const ASCII_ART = [
  '  █████╗  █████╗ ██████╗ ██╗██╗   ██╗',
  ' ██╔══██╗██╔══██╗██╔══██╗██║╚██╗ ██╔╝',
  ' ███████║███████║██║  ██║██║ ╚████╔╝ ',
  ' ██╔══██║██╔══██║██║  ██║██║  ╚██╔╝  ',
  ' ██║  ██║██║  ██║██████╔╝██║   ██║   ',
  ' ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   ',
];

/* ═══ SPLIT WORD REVEAL HELPER ═══ */
const SplitWordReveal = ({ text, className = '' }) => {
  // Handles mixed content like raw strings and simple JSX elements (if passed as array)
  // For simplicity, we just split a plain string here
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', verticalAlign: 'bottom' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-flex', overflow: 'hidden', paddingRight: '0.25em', paddingBottom: '0.1em', verticalAlign: 'bottom', marginBottom: '-0.1em' }}>
          <span className={className} style={{ display: 'inline-block', transform: 'translateY(120%)' }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

/* ═══ SECTION TRANSITION WRAPPER ═══ */
const SectionTransition = ({ children, zIndex, glass = false }) => {
  const ref = useRef(null);
  
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(el,
      { opacity: 0.85 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'top 25%',
          scrub: 0.4,
        }
      }
    );
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', zIndex, width: '100%' }}>
      <div className="section-inner-content">
        {children}
      </div>
    </div>
  );
};

/* ═══ KINETIC SECTION INTERSTITIAL (5 ULTRA-HEAVY WOW MODES) ═══ */
function SectionInterstitial({ tag, title, sub, diag, mode = 'scramble' }) {
  const ref = useRef(null);
  const [displayText, setDisplayText] = useState(title);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const titleEl = el.querySelector('.interstitial-title');
    const tagEl = el.querySelector('.interstitial-tag');
    const subEl = el.querySelector('.interstitial-sub');
    const chars = el.querySelectorAll('.interstitial-title .char');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 0.8
      }
    });

    if (mode === 'scramble') {
      // MODE 1: Kinetic Blur Materialize & Dissolve
      tl.fromTo(titleEl,
        { scale: 0.3, opacity: 0, letterSpacing: '0.4em', filter: 'blur(30px)' },
        { scale: 1, opacity: 1, letterSpacing: '-0.05em', filter: 'blur(0px)', duration: 0.35, ease: 'power3.out' },
        0
      );
      tl.to(titleEl, {
        scale: 1.8, opacity: 0, filter: 'blur(25px)', letterSpacing: '0.15em', duration: 0.35, ease: 'power2.in'
      }, 0.65);
    } 
    else if (mode === 'slice') {
      // MODE 2: 3D Character Flip & Explosive Scatter
      if (chars.length) {
        tl.fromTo(chars,
          { rotateY: 180, rotateX: -90, opacity: 0, scale: 0.2 },
          { rotateY: 0, rotateX: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.35, ease: 'back.out(2.5)' },
          0
        );
        chars.forEach((c, idx) => {
          const xDir = idx % 2 === 0 ? -200 : 200;
          const yDir = idx % 3 === 0 ? -100 : 100;
          tl.to(c, { xPercent: xDir, yPercent: yDir, opacity: 0, rotateZ: 45, duration: 0.35, ease: 'power3.in' }, 0.65);
        });
      }
    } 
    else if (mode === 'curtain') {
      // MODE 3: High-Contrast Solid Shutter Inversion (Double-door camera shutter)
      tl.fromTo(el,
        { clipPath: 'inset(0 50% 0 50%)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0%)', opacity: 1, duration: 0.35, ease: 'power3.out' },
        0
      );
      tl.to(el, {
        clipPath: 'inset(0 50% 0 50%)', opacity: 0, duration: 0.35, ease: 'power3.in'
      }, 0.65);
    } 
    else if (mode === 'tunnel') {
      // MODE 4: 3D Warp Drive Perspective Zoom (Passes Through Camera)
      tl.fromTo(titleEl,
        { scale: 3.5, opacity: 0, y: 150 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' },
        0
      );
      tl.to(titleEl, {
        scale: 4.5, opacity: 0, duration: 0.35, ease: 'expo.in'
      }, 0.65);
    } 
    else if (mode === 'matrix') {
      // MODE 5: Crisp Odometer Roll & Disintegration (NO NEON GLOW!)
      tl.fromTo(titleEl,
        { opacity: 0, letterSpacing: '0.6em', filter: 'blur(15px)' },
        { opacity: 1, letterSpacing: '-0.05em', filter: 'blur(0px)', duration: 0.35, ease: 'power3.out' },
        0
      );
      tl.to(titleEl, {
        letterSpacing: '1.4em', opacity: 0, filter: 'blur(20px)', duration: 0.35, ease: 'power3.in'
      }, 0.65);
    }

    // Shared Tag & Sub animations
    tl.fromTo([tagEl, subEl],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
      0.1
    );
    tl.to([tagEl, subEl], {
      y: -30, opacity: 0, duration: 0.35, ease: 'power3.in'
    }, 0.65);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.revert();
      tl.revert();
      tl.kill();
    };
  }, [mode, title]);

  // Hacker Scramble Effect (for scramble & matrix mode)
  useEffect(() => {
    if (mode !== 'scramble' && mode !== 'matrix') return;
    let interval;
    const chars = mode === 'matrix' ? '010101010189347209' : '!@#$%^&*()_+-=[]{}|;:,.<>?/';
    const original = title;
    let iteration = 0;

    const handleScramble = () => {
      clearInterval(interval);
      iteration = 0;
      interval = setInterval(() => {
        setDisplayText(
          original
            .split('')
            .map((char, index) => {
              if (index < iteration) return original[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= original.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);
    };

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 60%',
      onEnter: handleScramble,
      onEnterBack: handleScramble
    });

    return () => {
      clearInterval(interval);
      trigger.kill();
    };
  }, [mode, title]);

  return (
    <div className={`interstitial-sect mode-${mode}`} ref={ref}>
      <div className="interstitial-diag">{diag || 'LATENCY: 0.2ms // SECURE'}</div>
      <div className="interstitial-tag">{tag}</div>
      <h2 className={(mode === 'curtain' || mode === 'slice') ? 'interstitial-title' : 'interstitial-title gradient-text-1'}>
        {mode === 'slice' ? (
          title.split('').map((char, i) => (
            <span key={i} className="char gradient-text-1">{char}</span>
          ))
        ) : (
          displayText
        )}
      </h2>
      {sub && <p className="interstitial-sub">{sub}</p>}
    </div>
  );
}

/* ═══ PRELOADER ═══ */
function Preloader({ onDone }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    const chars = el.querySelectorAll('.preloader-text span');
    const sub = el.querySelector('.preloader-sub span');
    const fill = el.querySelector('.preloader-fill');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(el, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => { el.classList.add('done'); onDone(); },
        });
      },
    });

    tl.to(chars, { y: '0%', duration: 0.7, stagger: 0.035, ease: 'power3.out', delay: 0.4 });
    tl.to(sub, { y: '0%', duration: 0.5, ease: 'power3.out' }, '-=0.2');
    tl.to(fill, { width: '100%', duration: 1.2, ease: 'power2.inOut' }, '-=0.3');
    tl.to({}, { duration: 0.3 });
  }, { scope: ref });

  return (
    <div className="preloader" ref={ref}>
      <div className="preloader-text">
        {'Aadiy Khan'.split('').map((c, i) => (
          <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
        ))}
      </div>
      <div className="preloader-sub">
        <span>ML Engineer & Builder</span>
      </div>
      <div className="preloader-bar"><div className="preloader-fill" /></div>
    </div>
  );
}

/* ═══ CURSOR ═══ */
function Cursor() {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const move = (e) => {
      gsap.to(ref.current, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power2.out' });
    };
    const over = (e) => {
      if (e.target.closest('a, button, .project-card, .magnetic, .meta-row, .tl-item, .pixel-cat')) setExpanded(true);
    };
    const out = () => setExpanded(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, []);

  return <div ref={ref} className={`cursor${expanded ? ' expand' : ''}`} />;
}

/* ═══ SCROLL PROGRESS ═══ */
function ScrollProgress() {
  const ref = useRef(null);
  useGSAP(() => {
    gsap.to(ref.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2
      }
    });
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

/* ═══ MAGNETIC ═══ */
const Magnetic = ({ children }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const mouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', mouseMove);
    el.addEventListener('mouseleave', mouseLeave);
    
    return () => {
      el.removeEventListener('mousemove', mouseMove);
      el.removeEventListener('mouseleave', mouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref });
};

/* ═══ ANIMATED BACKGROUND ═══ */
function AnimatedBG() {
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const orbCRef = useRef(null);
  const watermarkRef = useRef(null);
  const watermarkRef2 = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.body.scrollHeight;
      const ratio = y / h;
      
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (!isLight) {
        if (ratio < 0.2) {
          document.body.style.backgroundColor = '#030305';
        } else if (ratio < 0.5) {
          document.body.style.backgroundColor = '#050308';
        } else if (ratio < 0.8) {
          document.body.style.backgroundColor = '#020505';
        } else {
          document.body.style.backgroundColor = '#050202';
        }
      } else {
        document.body.style.backgroundColor = 'var(--bg)';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(() => {
    // Deep Parallax for Orbs
    gsap.to(orbARef.current, { y: '100vh', x: '50vw', scale: 2, ease: 'none', scrollTrigger: { scrub: 0.5 } });
    gsap.to(orbBRef.current, { y: '-80vh', x: '-40vw', scale: 1.5, ease: 'none', scrollTrigger: { scrub: 0.8 } });
    gsap.to(orbCRef.current, { y: '120vh', x: '20vw', rotation: 360, ease: 'none', scrollTrigger: { scrub: 1 } });
    
    // Deep Parallax for Watermarks
    gsap.to(watermarkRef.current, { x: '-50vw', ease: 'none', scrollTrigger: { scrub: true } });
    gsap.fromTo(watermarkRef2.current, { x: '-30vw' }, { x: '20vw', ease: 'none', scrollTrigger: { scrub: true } });
  }, []);

  return (
    <>
      <div className="gradient-bg">
        <div className="mesh-orb orb-a" ref={orbARef} />
        <div className="mesh-orb orb-b" ref={orbBRef} />
        <div className="mesh-orb orb-c" ref={orbCRef} />
      </div>
      <div className="grid-overlay" />
      <ShootingStars />
      <div className="name-watermark" ref={watermarkRef}>
        AADIY KHAN &nbsp;&nbsp;&mdash;&nbsp;&nbsp; AADIY KHAN &nbsp;&nbsp;&mdash;&nbsp;&nbsp; AADIY KHAN
      </div>
      <div className="name-watermark w2" ref={watermarkRef2}>
        ML ENGINEER &nbsp;&nbsp;&mdash;&nbsp;&nbsp; RESEARCHER &nbsp;&nbsp;&mdash;&nbsp;&nbsp; DEVELOPER
      </div>
    </>
  );
}



const PixelAvatarSVG = ({ isLight }) => (
  <svg viewBox="0 0 16 16" style={{ width: '100%', height: '100%', shapeRendering: 'crispEdges' }}>
    <rect width="16" height="16" fill={isLight ? "#e2e8f0" : "#0a0a0c"} />
    
    {/* Head / Skin */}
    <rect x="4" y="3" width="8" height="8" fill={isLight ? "#ffcda2" : "#e2a88d"} />
    <rect x="3" y="5" width="10" height="5" fill={isLight ? "#ffcda2" : "#e2a88d"} />
    <rect x="4" y="10" width="8" height="1" fill={isLight ? "#e5b38a" : "#c48a70"} /> {/* Chin shadow */}
    
    {/* Hair */}
    <rect x="4" y="2" width="8" height="2" fill="#1c1c1c" />
    <rect x="3" y="3" width="10" height="1" fill="#1c1c1c" />
    <rect x="2" y="4" width="2" height="4" fill="#1c1c1c" />
    <rect x="12" y="4" width="2" height="4" fill="#1c1c1c" />
    <rect x="3" y="4" width="3" height="1" fill="#1c1c1c" />
    
    {/* Cyberpunk Visor/Glasses */}
    <rect x="3" y="6" width="10" height="2" fill="#0a0a0a" />
    <rect x="3" y="6" width="10" height="1" fill={isLight ? "#0a0a0a" : "var(--cyan)"} />
    <rect x="4" y="6" width="2" height="1" fill="#fff" /> {/* Glare */}
    <rect x="11" y="6" width="1" height="1" fill="#fff" />
    <rect x="2" y="6" width="1" height="1" fill="#0a0a0a" />
    <rect x="13" y="6" width="1" height="1" fill="#0a0a0a" />
    
    {/* Neck */}
    <rect x="6" y="11" width="4" height="2" fill={isLight ? "#e5b38a" : "#c48a70"} />
    
    {/* Tech Jacket */}
    <rect x="3" y="12" width="10" height="1" fill={isLight ? "#ffffff" : "#2d2d35"} />
    <rect x="2" y="13" width="12" height="3" fill={isLight ? "#ffffff" : "#2d2d35"} />
    <rect x="1" y="14" width="14" height="2" fill={isLight ? "#ffffff" : "#2d2d35"} />
    
    {/* Jacket collar and zipper glow */}
    <rect x="5" y="12" width="2" height="1" fill={isLight ? "#e2e8f0" : "#444"} />
    <rect x="9" y="12" width="2" height="1" fill={isLight ? "#e2e8f0" : "#444"} />
    <rect x="7" y="12" width="2" height="4" fill={isLight ? "#e2e8f0" : "var(--cyan)"} />
    <rect x="7" y="13" width="1" height="3" fill={isLight ? "#cbd5e1" : "#fff"} />
  </svg>
);


/* ═══ LANYARD ID CARD (HERO RIGHT) ═══ */
function LanyardCard({ loaded, themeMode }) {
  const isLight = themeMode === 'light';
  const dropRef = useRef(null);
  const swingRef = useRef(null);
  const stringRef = useRef(null);
  const dragData = useRef({ isDragging: false });

  // 1. Smooth GSAP Drop Animation
  useEffect(() => {
    if (!loaded || !dropRef.current) return;
    // initial smooth drop from ceiling
    gsap.fromTo(dropRef.current, 
      { y: -1500 }, 
      { y: 0, duration: 2.2, ease: "elastic.out(1, 0.4)", delay: 0.1 }
    );
  }, [loaded]);

  // 2. Interactive Physics Engine
  useEffect(() => {
    if (!loaded) return;
    
    // Physics Configuration
    const L = 220; // Longer rest length for the string
    const k = 0.025; // Spring constant (lower = softer/slower bounce)
    const damping = 0.95; // Air resistance
    const gravity = 1.0; 
    const mass = 1;

    // Start in perfect equilibrium
    let x = 0;
    let y = 220; 
    let vx = 0;
    let vy = 0;
    
    let animId;
    let lastTime = performance.now();
    const timeStep = 1000 / 60; // 60fps fixed time step

    const update = () => {
      const now = performance.now();
      let dt = now - lastTime;
      
      // Prevent physics explosion if tab was inactive
      if (dt > 100) dt = 16.66; 
      
      // Fixed timestep loop for perfect consistency across all monitor refresh rates (60hz, 144hz, etc)
      while (dt >= timeStep) {
          if (!dragData.current.isDragging) {
             const currentL = Math.sqrt(x*x + y*y) || 1;
             
             // Hooke's Law: F = -k * x
             let stretch = currentL - L;
             
             // Clamp stretch to prevent physics explosion if pulled too far
             const MAX_STRETCH = 500;
             if (stretch > MAX_STRETCH) stretch = MAX_STRETCH;
             if (stretch < -MAX_STRETCH) stretch = -MAX_STRETCH;
             
             const F_spring = -k * stretch;
             
             // Break spring force into x and y vectors
             const Fx = F_spring * (x / currentL);
             const Fy = F_spring * (y / currentL);
             
             // F = ma -> a = F/m
             const ax = Fx / mass;
             const ay = (Fy + gravity) / mass;
             
             // Apply acceleration to velocity
             vx += ax;
             vy += ay;
             
             // Clamp velocity to prevent glitching out of frame bounds
             const MAX_V = 80;
             if (vx > MAX_V) vx = MAX_V;
             if (vx < -MAX_V) vx = -MAX_V;
             if (vy > MAX_V) vy = MAX_V;
             if (vy < -MAX_V) vy = -MAX_V;
             
             // Apply damping
             vx *= damping;
             vy *= damping;
             
             // Apply velocity to position
             x += vx;
             y += vy;
          }
          dt -= timeStep;
      }
      lastTime = now - dt; // save remainder

      // Calculate angle and stretch for DOM
      const currentL = Math.sqrt(x*x + y*y) || 1;
      const angle = -Math.atan2(x, y); 
      
      if (swingRef.current) {
         swingRef.current.style.transform = `rotate(${angle}rad)`;
      }
      if (stringRef.current) {
         stringRef.current.style.height = `${currentL}px`;
      }
      
      animId = requestAnimationFrame(update);
    };
    
    animId = requestAnimationFrame(update);

    // Realistic Drag & Release interaction
    const onMouseMove = (e) => {
       if (dragData.current.isDragging) {
         const pivot = document.getElementById('lanyard-pivot');
         if (!pivot) return;
         const rect = pivot.getBoundingClientRect();
         const pivotX = rect.left + rect.width / 2;
         const pivotY = rect.top;
         
         // Set physics coords based on mouse
         x = e.clientX - pivotX;
         y = Math.max(20, e.clientY - pivotY); 
         
         vx = 0;
         vy = 0;
       }
    };
    const onMouseUp = () => { dragData.current.isDragging = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [loaded]);

  return (
      <div id="lanyard-pivot" className="lanyard-pivot" ref={dropRef} style={{ position: 'absolute', top: -50, right: '15%', width: 320, zIndex: 50, pointerEvents: 'none', transform: 'translateY(-1500px)' }}>
      <div 
        ref={swingRef} 
        style={{ width: '100%', transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} 
      >
        
        {/* The String */}
        <div ref={stringRef} style={{ width: 6, height: 220, background: isLight ? 'repeating-linear-gradient(45deg, #bbb, #bbb 10px, #ddd 10px, #ddd 20px)' : 'repeating-linear-gradient(45deg, #111, #111 10px, #222 10px, #222 20px)', boxShadow: isLight ? '2px 0 5px rgba(0,0,0,0.1)' : '4px 0 10px rgba(0,0,0,0.8)', minHeight: 40 }} />
        
        {/* The Clip Hardware */}
        <div style={{ width: 24, height: 16, border: isLight ? '2px solid #aaa' : '2px solid #666', borderRadius: '6px 6px 0 0', background: isLight ? 'linear-gradient(to right, #ccc, #eee, #ccc)' : 'linear-gradient(to right, #333, #555, #333)', marginTop: -2, zIndex: 2 }} />
        <div style={{ width: 14, height: 20, border: isLight ? '2px solid #bbb' : '2px solid #777', borderTop: 'none', background: isLight ? '#eee' : '#444', marginTop: 0, zIndex: 1 }} />
        <div style={{ width: 30, height: 8, background: isLight ? '#ddd' : '#222', borderRadius: 4, marginTop: -4, border: isLight ? '1px solid #aaa' : '1px solid #444', zIndex: 3 }} />

        {/* The ID Card */}
        <div 
          className="id-card" 
          onMouseDown={(e) => { dragData.current.isDragging = true; e.preventDefault(); }}
          style={{
            pointerEvents: 'auto',
            cursor: 'grab',
            width: 320, height: 500, 
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 10, 12, 0.65)', 
            backdropFilter: 'blur(30px)', 
            border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)', 
            borderRadius: 20, padding: 24, 
            boxShadow: isLight ? '0 30px 60px rgba(0,0,0,0.15), inset 0 0 30px rgba(0,0,0,0.02)' : '0 50px 100px rgba(0,0,0,0.9), inset 0 0 30px rgba(0, 212, 170, 0.05)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 8, position: 'relative', overflow: 'hidden'
        }}>
          {/* Holographic Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: isLight ? 'linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.6) 50%, transparent 60%)' : 'linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.1) 50%, transparent 60%)', pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: isLight ? '#000' : '#fff', fontFamily: 'var(--sans)', letterSpacing: '-0.05em', lineHeight: 1 }}>AK_LABS</span>
              <span style={{ fontSize: 9, letterSpacing: 3, color: isLight ? 'var(--accent2)' : 'var(--cyan)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginTop: 4 }}>RESEARCH_ACCESS</span>
            </div>
            
            {/* Microchip */}
            <div style={{ width: 40, height: 30, background: '#d4af37', borderRadius: 4, border: '1px solid #aa8822', display: 'flex', flexWrap: 'wrap', padding: 2, gap: 2, opacity: 0.9 }}>
              {Array(15).fill(0).map((_, i) => <div key={i} style={{ width: '15%', height: '25%', background: 'rgba(0,0,0,0.2)' }} />)}
            </div>
          </div>
          
          {/* Photo Section */}
          <div style={{ width: '100%', display: 'flex', gap: 20, marginBottom: 24 }}>
            <div style={{ width: 140, height: 160, borderRadius: 8, overflow: 'hidden', border: isLight ? '2px solid rgba(0,0,0,0.1)' : '2px solid rgba(255,255,255,0.1)', background: isLight ? '#e2e8f0' : '#000', position: 'relative' }}>
              <PixelAvatarSVG isLight={isLight} />
              {/* Scanline overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)', pointerEvents: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: isLight ? '#666' : '#666', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Clearance</div>
                <div style={{ fontSize: 14, color: isLight ? 'var(--accent)' : '#ff4757', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>LEVEL 9_OMNI</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: isLight ? '#666' : '#666', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Department</div>
                <div style={{ fontSize: 13, color: isLight ? '#000' : '#fff', fontFamily: 'var(--mono)' }}>Neural_Nets</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: isLight ? '#666' : '#666', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Blood Type</div>
                <div style={{ fontSize: 13, color: isLight ? '#000' : '#fff', fontFamily: 'var(--mono)' }}>O+ [Augmented]</div>
              </div>
            </div>
          </div>
          
          {/* Main Info */}
          <h3 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px', color: isLight ? '#000' : '#fff', fontFamily: 'var(--sans)', letterSpacing: '-0.02em' }}>Aadiy Khan</h3>
          <p style={{ color: 'var(--dim)', fontSize: 14, margin: '0 0 20px', fontFamily: 'var(--mono)' }}>ID: <span style={{ color: isLight ? '#000' : '#fff' }}>0x7F4A_99B</span></p>
          
          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer Barcode */}
          <div style={{ width: '100%', borderTop: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ width: '70%', height: 40, display: 'flex', alignItems: 'center', opacity: 0.8 }}>
              {/* Complex Barcode */}
              <div style={{ width: '100%', height: '100%', backgroundImage: isLight ? 'repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 5px, #000 5px, #000 6px, transparent 6px, transparent 11px, #000 11px, #000 15px, transparent 15px, transparent 17px, #000 17px, #000 20px, transparent 20px, transparent 24px)' : 'repeating-linear-gradient(90deg, #fff 0, #fff 2px, transparent 2px, transparent 5px, #fff 5px, #fff 6px, transparent 6px, transparent 11px, #fff 11px, #fff 15px, transparent 15px, transparent 17px, #fff 17px, #fff 20px, transparent 20px, transparent 24px)' }} />
            </div>
            {/* Fake Signature */}
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)', transform: 'rotate(-5deg)' }}>A.Khan</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ HERO ═══ */
function Hero({ loaded, themeMode }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!loaded || !ref.current) return;
    const el = ref.current;

    const tl = gsap.timeline({ delay: 0.1 });
    const nameEls = el.querySelectorAll('.hero-name');
    const taglineEl = el.querySelector('.hero-tagline');
    const descEl = el.querySelector('.hero-desc');
    const actionEls = el.querySelectorAll('.hero-actions > *');

    if (nameEls.length) {
      tl.to(nameEls, {
        y: '0%', duration: 1.4, stagger: 0.1, ease: 'expo.out',
      });
    }
    if (taglineEl) {
      tl.to(taglineEl, {
        y: '0%', duration: 1.2, ease: 'expo.out',
      }, '-=1.0');
    }
    if (descEl) {
      tl.to(descEl, {
        y: '0%', duration: 1.2, ease: 'expo.out',
      }, '-=1.0');
    }
    if (actionEls.length) {
      tl.to(actionEls, {
        y: '0%', duration: 1, stagger: 0.1, ease: 'expo.out',
      }, '-=1.0');
    }
  }, { scope: ref, dependencies: [loaded] });

  return (
    <section className="sect hero" id="home" ref={ref}>
      
      <div className="hero-content">
        <div className="hero-name-wrap">
          <div className="hero-name gradient-text-1" style={{ transform: 'translateY(120%)' }}>Aadiy</div>
        </div>
        <div className="hero-name-wrap">
          <div className="hero-name gradient-text-2" style={{ transform: 'translateY(120%)' }}>
            <span className="serif-accent">Khan.</span>
          </div>
        </div>
        <div className="hero-tagline-wrap">
          <p className="hero-tagline" style={{ transform: 'translateY(120%)' }}>
            <span className="accent">●</span> &nbsp;ML Engineer &nbsp;/ &nbsp;Deep Learning &nbsp;/ &nbsp;Building from First Principles
          </p>
        </div>
        <div className="hero-desc-wrap">
          <p className="hero-desc" style={{ transform: 'translateY(120%)' }}>
            CS undergrad @ VIT Bhopal. I implement research papers, architect ML pipelines,
            and ship real products — not just notebooks.
          </p>
        </div>
        <div className="hero-actions">
          <Magnetic><a href="#projects" className="btn-main" style={{ transform: 'translateY(120%)' }}>View Work →</a></Magnetic>
          <Magnetic><a href="#contact" className="btn-outline" style={{ transform: 'translateY(120%)' }}>Get in Touch</a></Magnetic>
        </div>
      </div>

      <div className="scroll-cue">
        <div className="scroll-cue-line" />
        <span>Scroll down</span>
      </div>

      {/* Right Content */}
      <LanyardCard loaded={loaded} themeMode={themeMode} />

    </section>
  );
}

/* ═══ MARQUEE ═══ */
function Marquee() {
  const items = [...SKILLS, ...SKILLS, ...SKILLS];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((s, i) => (
          <span key={i} className={s === '◆' ? 'dot' : ''}>{s}</span>
        ))}
      </div>
    </div>
  );
}



/* ═══ ABOUT ═══ */
function About() {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    
    // Word reveal with stagger + subtle rotation
    gsap.fromTo(el.querySelectorAll('.sect-heading .word-reveal'), 
      { y: '120%', rotateX: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 85%' }, y: '0%', rotateX: 0, opacity: 1, duration: 1.4, stagger: 0.08, ease: 'expo.out' }
    );
    
    // About grid: slide from left with clip reveal
    const aboutText = el.querySelector('.about-text');
    const aboutMeta = el.querySelector('.about-meta');
    if (aboutText) {
      gsap.fromTo(aboutText,
        { x: -60, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { scrollTrigger: { trigger: el, start: 'top 70%' }, x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.out' }
      );
    }
    if (aboutMeta) {
      gsap.fromTo(aboutMeta,
        { x: 60, opacity: 0, clipPath: 'inset(0 0 0 100%)' },
        { scrollTrigger: { trigger: el, start: 'top 70%' }, x: 0, opacity: 1, clipPath: 'inset(0 0 0 0%)', duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );
    }

    // Meta rows stagger from right
    gsap.fromTo(el.querySelectorAll('.meta-row'),
      { x: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 65%' }, x: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }
    );

    gsap.fromTo(el.querySelectorAll('.reveal'),
      { y: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: ref });

  return (
    <section className="sect sect-about" id="about" ref={ref}>
      <p className="sect-label reveal">01 — About</p>
      <h2 className="sect-heading gradient-text-1">
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', overflow: 'hidden' }}>
          <span className="word-reveal" style={{ transform: 'translateY(120%)', display: 'inline-block', marginRight: '0.25em' }}>Not</span>
          <span className="word-reveal" style={{ transform: 'translateY(120%)', display: 'inline-block', marginRight: '0.25em' }}>your</span>
          <span className="word-reveal" style={{ transform: 'translateY(120%)', display: 'inline-block', marginRight: '0.25em' }}>typical</span>
          <span className="word-reveal serif" style={{ transform: 'translateY(120%)', display: 'inline-block' }}>CS student.</span>
        </span>
      </h2>
      <div className="about-grid">
        <div className="about-text reveal">
          <p>
            I don't just call APIs — I <strong>build what's behind them</strong>.
            I've reimplemented the full Transformer architecture from the original paper,
            built anomaly detection processing 2.5M+ records in real-time,
            and fine-tuned language models cutting 75% of manual triage effort.
          </p>
          <p>
            Currently interning at the <strong>Ministry of Defence</strong>, building
            computer vision systems for industrial quality inspection on live manufacturing lines.
            I care about <strong>craft</strong> — clean code, thoughtful systems,
            and ML that works at scale, not just in a notebook.
          </p>
        </div>
        <div className="about-meta reveal">
          {[
            ['Location', 'India'],
            ['Education', 'B.Tech CS, VIT Bhopal'],
            ['Focus', 'Deep Learning & MLOps'],
            ['Currently', 'Defence AI Intern'],
            ['Languages', 'Python, JS, C++'],
            ['Interests', 'Research Papers, OSS'],
          ].map(([k, v]) => (
            <div className="meta-row" key={k}>
              <span className="meta-k">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ PROFESSIONAL EDITORIAL PROJECTS ═══ */
function Projects({ data }) {
  const sectionRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header animation
    gsap.fromTo(section.querySelectorAll('.pro-header-anim'),
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: section, start: 'top 80%' }, opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
    );

    // Stagger in the rows
    gsap.fromTo(section.querySelectorAll('.pro-row'),
      { opacity: 0, x: -20 },
      { scrollTrigger: { trigger: section, start: 'top 75%' }, opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    );
  }, { dependencies: [data] });

  const toggleRow = (i) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <section className="sect projects-sect pro" id="projects" ref={sectionRef}>
      <div className="pro-header-container">
        <div className="sect-label pro-header-anim">Selected Work</div>
        <h2 className="sect-heading pro-header-anim">Engineering & Design</h2>
      </div>

      <div className="pro-list">
        {data.map((proj, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div 
              key={i} 
              className={`pro-row ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleRow(i)}
            >
              <div className="pro-row-header">
                <span className="pro-year">202{6 - i}</span>
                <h3 className="pro-name">{proj.name}</h3>
                <div className="pro-tags">
                  {proj.stack.slice(0, 3).map(s => <span className="pro-tag" key={s}>{s}</span>)}
                </div>
                <div className="pro-arrow">↗</div>
              </div>

              <div className="pro-row-body">
                <div className="pro-row-body-inner">
                  <div className="pro-content-grid">
                    <div className="pro-image-wrap">
                      <img src={PROJECT_IMAGES[proj.name] || imgTransformer} alt={proj.name} className="pro-image" />
                    </div>
                    
                    <div className="pro-details">
                      <p className="pro-desc">
                        {proj.desc}. Focused on performance, minimal dependencies, and high-quality user experience. Built from first principles to ensure complete control over the architecture.
                      </p>
                      
                      <div className="pro-metrics">
                        {proj.stack.map(s => <span className="pro-metric" key={s}>{s}</span>)}
                        {proj.metrics && proj.metrics.map(m => <span className="pro-metric" key={m}>{m}</span>)}
                      </div>

                      <div className="pro-links">
                        {proj.links.map(l => (
                          <a 
                            key={l.label} 
                            href={l.url} 
                            className="pro-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            {l.label} <span>↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══ EXPERIENCE ═══ */
function Experience({ data }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    
    // Heading: dramatic scale-up from nothing
    gsap.fromTo(el.querySelector('.sect-heading'),
      { opacity: 0, y: 50, scale: 0.8, filter: 'blur(12px)' },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
    );

    // Each experience item: horizontal slide with clip-path reveal
    const items = el.querySelectorAll('.exp-item');
    items.forEach((item, i) => {
      gsap.fromTo(item,
        { 
          clipPath: 'inset(0 0 0 100%)', 
          x: 80, 
          opacity: 0 
        },
        { 
          scrollTrigger: { trigger: item, start: 'top 85%' }, 
          clipPath: 'inset(0 0 0 0%)', 
          x: 0, 
          opacity: 1, 
          duration: 1, 
          delay: i * 0.12,
          ease: 'power4.out' 
        }
      );
    });

    gsap.fromTo(el.querySelectorAll('.reveal'),
      { y: 60, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: ref, dependencies: [data] });

  return (
    <section className="sect sect-experience" id="experience" ref={ref}>
      <p className="sect-label reveal">03 — Experience</p>
      <h2 className="sect-heading reveal">Where I've <em className="serif">worked.</em></h2>
      {data.map((exp, i) => (
        <div className="exp-item reveal" key={i}>
          <span className="exp-date">{exp.date}</span>
          <div>
            <h3 className="exp-role">{exp.role}</h3>
            <p className="exp-org">{exp.org}</p>
            <ul className="exp-bullets">
              {exp.desc.map((d, j) => <li key={j}>{d}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}

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

/* ═══ STATS ═══ */
function Stats({ themeMode }) {
  const ref = useRef(null);
  const [githubStats, setGithubStats] = useState({ repos: 0, followers: 0, papers: 6 });

  useEffect(() => {
    fetch('https://api.github.com/users/AadiyKhan')
      .then(res => res.json())
      .then(data => {
        if (data.public_repos !== undefined) {
          setGithubStats(prev => ({ ...prev, repos: data.public_repos, followers: data.followers }));
        }
      })
      .catch(err => console.error("Failed to fetch GitHub stats", err));
  }, []);

  useGSAP(() => {
    const el = ref.current;
    if (!el || githubStats.repos === 0) return; // Wait until fetched

    gsap.fromTo(el.querySelector('.sect-heading'),
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: el, start: 'top 85%' }, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(el.querySelectorAll('.stat-cell'),
      { y: 60, opacity: 0, skewY: 5 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.1, ease: 'power4.out', transformOrigin: "left top" }
    );

    gsap.fromTo(el.querySelector('.heatmap-wrap'),
      { y: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    el.querySelectorAll('.stat-number').forEach((numEl) => {
      const target = parseInt(numEl.dataset.value, 10);
      if (isNaN(target)) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: numEl, start: 'top 85%' },
        onUpdate: () => {
          numEl.textContent = Math.round(obj.val).toLocaleString();
        },
      });
    });
  }, { scope: ref, dependencies: [githubStats] });

  return (
    <section className="sect sect-stats" id="stats" ref={ref}>
      <p className="sect-label">05 — Stats</p>
      <h2 className="sect-heading">By the <em className="serif">numbers.</em></h2>
      <div className="stats-row">
        {[
          [githubStats.followers.toString(), 'GitHub Followers'],
          [githubStats.repos.toString(), 'Public Repositories'],
          [githubStats.papers.toString(), 'Research Papers Read'],
        ].map(([n, l]) => (
          <div className="stat-cell" key={l}>
            <div className="stat-number" data-value={n}>0</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
      <div className="heatmap-wrap">
        <div className="heatmap-header">
          <span className="label">Contribution Activity</span>
          <span style={{ color: 'var(--dim)' }}>Last 12 months</span>
        </div>
        <div className="heatmap-scroll">
          <GitHubCalendar 
            username="AadiyKhan" 
            colorScheme={themeMode}
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ═══ CRT TERMINAL ═══ */
function CRTTerminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [booted, setBooted] = useState(false);
  const bodyRef = useRef(null);
  const sectionRef = useRef(null);

  useGSAP(() => {
    const el = sectionRef.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      once: true,
      onEnter: () => runBootSequence(),
    });
  }, { scope: sectionRef });

  const runBootSequence = () => {
    const bootLines = [
      { type: 'ascii', text: ASCII_ART.join('\n') },
      { type: 'out', text: '' },
      { type: 'system', text: '> Initializing aadiy.sh v2.0...' },
      { type: 'system', text: '> Loading modules... ██████████ 100%' },
      { type: 'system', text: '> System ready.' },
      { type: 'out', text: '' },
      { type: 'success', text: 'Welcome. Type "help" to see what I can do.' },
      { type: 'success', text: 'Try: "about", "skills", "theme light", "theme dark"' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= bootLines.length) {
        clearInterval(interval);
        setBooted(true);
        return;
      }
      const line = bootLines[i]; 
      setLines((prev) => [...prev, line]);
      i++;
      if (bodyRef.current) bodyRef.current.scrollTop = 99999;
    }, 180);
  };

  const commands = {
    help: () => [
      { type: 'out', text: '┌─────────────────────────────────────┐' },
      { type: 'out', text: '│  COMMANDS                           │' },
      { type: 'out', text: '├─────────────────────────────────────┤' },
      { type: 'out', text: '│  about      → Who am I              │' },
      { type: 'out', text: '│  skills     → Tech stack            │' },
      { type: 'out', text: '│  projects   → My work               │' },
      { type: 'out', text: '│  contact    → Reach me              │' },
      { type: 'out', text: '│  whoami     → Identity              │' },
      { type: 'out', text: '│  theme <mode> → dark | light        │' },
      { type: 'out', text: '│  clear      → Clear terminal        │' },
      { type: 'out', text: '│  neofetch   → System info           │' },
      { type: 'out', text: '└─────────────────────────────────────┘' },
    ],
    about: () => [
      { type: 'out', text: 'Aadiy Khan — CS @ VIT Bhopal' },
      { type: 'out', text: 'I build ML systems from first principles.' },
      { type: 'out', text: 'Currently: Defence AI Intern (Computer Vision)' },
      { type: 'out', text: 'Focus: Transformers, MLOps, Deep Learning' },
    ],
    skills: () => [
      { type: 'success', text: '▸ Python  ▸ PyTorch  ▸ TensorFlow  ▸ Transformers' },
      { type: 'success', text: '▸ Docker  ▸ Kafka    ▸ React       ▸ Node.js' },
      { type: 'success', text: '▸ OpenCV  ▸ Git      ▸ Linux       ▸ C++' },
    ],
    projects: () => [
      { type: 'out', text: '[01] Transformer From Scratch — Full "Attention Is All You Need"' },
      { type: 'out', text: '[02] NADS — Real-time anomaly detection, 2.5M+ records' },
      { type: 'out', text: '[03] FlowBERT — Multi-task NLP, 75% triage effort reduction' },
    ],
    contact: () => [
      { type: 'success', text: 'Email: aadiykhan@gmail.com' },
      { type: 'success', text: 'GitHub: github.com/AadiyKhan' },
      { type: 'success', text: 'LinkedIn: linkedin.com/in/aadiykhan' },
    ],
    whoami: () => [{ type: 'success', text: 'A curious mind with a GPU and too many tabs open.' }],
    neofetch: () => [
      { type: 'ascii', text: ASCII_ART.join('\n') },
      { type: 'out', text: '' },
      { type: 'out', text: 'OS: Human v22.0 (Bhopal Edition)' },
      { type: 'out', text: 'Shell: aadiy.sh v2.0' },
      { type: 'out', text: 'Uptime: 22 years' },
      { type: 'out', text: 'CPU: Neural Network (8B params, underfunded)' },
      { type: 'out', text: 'GPU: Borrowed cloud instances' },
      { type: 'out', text: 'Memory: Mostly stack overflow links' },
      { type: 'out', text: 'Theme: Dark (always)' },
    ],
    clear: () => '__CLEAR__',
  };

  const handleTheme = (arg) => {
    if (arg === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      return [{ type: 'success', text: 'Theme switched to Light Mode ☀️' }];
    } else if (arg === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      return [{ type: 'success', text: 'Theme switched to Dark Mode 🌙' }];
    }
    return [{ type: 'error', text: `Unknown theme: "${arg}". Try: light, dark` }];
  };

  const exec = (e) => {
    if (e.key !== 'Enter' || !input.trim()) return;
    const raw = input.trim();
    const [cmd, ...args] = raw.toLowerCase().split(' ');
    const newLines = [{ type: 'cmd', text: raw }];

    if (cmd === 'theme') {
      newLines.push(...handleTheme(args[0] || ''));
    } else if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    } else {
      const fn = commands[cmd];
      if (fn) {
        const result = fn();
        if (Array.isArray(result)) newLines.push(...result);
      } else {
        newLines.push({ type: 'error', text: `Command not found: "${cmd}". Type "help" for commands.` });
      }
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput('');
    setTimeout(() => { if (bodyRef.current) bodyRef.current.scrollTop = 99999; }, 50);
  };

  return (
    <section className="crt-section" id="terminal" ref={sectionRef}>
      <div className="crt-wrapper">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="btn-close" />
              <span className="btn-min" />
              <span className="btn-max" />
            </div>
            <span className="terminal-title">aadiy.sh — v2.0</span>
          </div>
          <div className="terminal-body" ref={bodyRef}>
            {lines.map((l, i) => {
              if (!l) return null;
              return (
                <div className="term-line" key={i}>
                  {l.type === 'cmd' && <><span className="prompt">aadiy@portfolio:~$ </span><span className="user">{l.text}</span></>}
                  {l.type === 'out' && <span>{l.text}</span>}
                  {l.type === 'system' && <span style={{ color: '#888' }}>{l.text}</span>}
                  {l.type === 'success' && <span style={{ color: 'var(--cyan)' }}>{l.text}</span>}
                  {l.type === 'error' && <span style={{ color: '#ff5f56' }}>{l.text}</span>}
                  {l.type === 'ascii' && <pre style={{ color: 'var(--accent)', fontSize: '11px' }}>{l.text}</pre>}
                </div>
              );
            })}
            {!booted && lines.length > 0 && <span className="cursor-block">█</span>}
            
            {booted && (
              <div className="term-input-line">
                <span className="prompt">aadiy@portfolio:~$</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={exec}
                  placeholder="type a command..."
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ CONTACT ═══ */
function Contact() {
  const ref = useRef(null);
  const [form, setForm] = useState({ botField: '', name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useGSAP(() => {
    const el = ref.current;

    gsap.fromTo(el.querySelector('.contact-heading'),
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(el.querySelectorAll('.reveal'),
      { y: 30, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: ref });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new URLSearchParams();
      formData.append('form-name', 'contact');
      formData.append('bot-field', form.botField);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('message', form.message);
      
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      setSent(true);
      setForm({ botField: '', name: '', email: '', message: '' });
    } catch (err) { console.error(err); }
    setSending(false);
  };

  return (
    <section className="sect sect-contact" id="contact" ref={ref}>
      <div className="contact-split">
        <div className="reveal">
          <h2 className="contact-heading gradient-text-1">
            Let's build<br />something <em className="serif">together.</em>
          </h2>
          <p className="contact-info">
            Open to research collaborations, interesting projects,
            or conversations about ML architecture and systems design.
          </p>
          <div className="contact-links">
            <a href="mailto:aadiykhan@gmail.com">→ aadiykhan@gmail.com</a>
            <a href="https://github.com/AadiyKhan" target="_blank" rel="noopener noreferrer">→ github.com/AadiyKhan</a>
            <a href="https://linkedin.com/in/aadiykhan" target="_blank" rel="noopener noreferrer">→ linkedin.com/in/aadiykhan</a>
          </div>
        </div>
        <form className="form-stack reveal" name="contact" method="POST" data-netlify="true" onSubmit={submit}>
          <input type="hidden" name="form-name" value="contact" />
          <p style={{ display: 'none' }}>
            <label>
              Don't fill this out if you're human: 
              <input name="bot-field" value={form.botField} onChange={(e) => setForm({ ...form, botField: e.target.value })} />
            </label>
          </p>
          {sent ? (
            <div style={{ padding: '40px 0', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--cyan)' }}>
              Message sent. I'll be in touch. ✓
            </div>
          ) : (
            <>
              <div className="form-field">
                <label>Name</label>
                <input type="text" name="name" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Message</label>
                <textarea name="message" placeholder="What's on your mind?" value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Magnetic>
                <button type="submit" className="submit-btn" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message →'}
                </button>
              </Magnetic>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

/* ═══ THE MONOLITH FOOTER ═══ */
function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTime(new Intl.DateTimeFormat([], options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer-monolith">
      {/* Infinite Scrolling Top Bar */}
      <div className="footer-ticker">
        <div className="ticker-track">
           {Array(6).fill("SYSTEMS ONLINE // ML RESEARCH // OPEN TO OPPORTUNITIES // ").map((text, i) => (
             <span key={i}>{text}</span>
           ))}
        </div>
      </div>

      <div className="footer-monolith-center">
        <Magnetic>
          <a href="mailto:aadiykhan@gmail.com" className="monolith-cta">
            <div className="cta-spin-text">
              <svg viewBox="0 0 200 200" className="spin-svg">
                <path id="circlePath" d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" fill="none" />
                <text>
                  <textPath href="#circlePath" startOffset="0%">
                    LET'S BUILD SOMETHING FASCINATING • LET'S BUILD SOMETHING FASCINATING • 
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="cta-arrow">↗</div>
          </a>
        </Magnetic>
      </div>

      <div className="footer-monolith-bottom">
        <div className="fm-left">
          <p>AADIY KHAN</p>
          <p>VIT BHOPAL // {time ? `${time} IST` : '...'}</p>
        </div>
        <div className="fm-right">
          <a href="https://github.com/AadiyKhan" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href="https://linkedin.com/in/aadiykhan" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </div>
    </footer>
  );
}

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

/* ═══════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [sweep, setSweep] = useState(null);
  const [showDinoGame, setShowDinoGame] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const catRef = useRef(null);
  const [catRect, setCatRect] = useState(null);

  const handleOpenGame = () => {
    if (catRef.current) {
      setCatRect(catRef.current.getBoundingClientRect());
    }
    setShowDinoGame(true);
  };

  const toggleTheme = (e) => {
    const isDark = themeMode === 'dark';
    const applyTheme = () => {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        setThemeMode('light');
      } else {
        document.documentElement.removeAttribute('data-theme');
        setThemeMode('dark');
      }
    };

    if (!document.startViewTransition) {
      applyTheme();
      return;
    }

    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    
    const transition = document.startViewTransition(() => {
      applyTheme();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 1000,
          easing: 'cubic-bezier(0.85, 0, 0.15, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeMode(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setData(portfolioData);
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after layout settles
    setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => lenis.destroy();
  }, [loaded]);

  const onPreloaderDone = useCallback(() => setLoaded(true), []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!data || !data.projects) return null;

  return (
    <>
      {!loaded && <Preloader onDone={onPreloaderDone} />}
      <ScrollProgress />
      <Cursor />
      <div className="grain" />
      <AnimatedBG />
      <SectionDots scrollTo={scrollTo} />

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
        {['about', 'projects', 'experience', 'journey', 'terminal', 'contact'].map((s) => (
          <a key={s} onClick={() => { scrollTo(s); setMobileMenuOpen(false); }}>{s}</a>
        ))}
      </div>

      <nav className="nav">
        <div className="nav-logo" onClick={() => scrollTo('home')}>AK.</div>
        <ul className="nav-links">
          {['about', 'projects', 'experience', 'journey', 'terminal'].map((s) => (
            <li key={s}><a onClick={() => scrollTo(s)}>{s}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <PixelCat 
            innerRef={catRef}
            onClick={handleOpenGame}
            style={{ opacity: showDinoGame ? 0 : 1 }}
          />
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {themeMode === 'light' ? '🌙' : '☀️'}
          </button>
          <Magnetic>
            <button className="nav-cta" onClick={() => scrollTo('contact')}>Contact</button>
          </Magnetic>
          <button 
            className={`hamburger${mobileMenuOpen ? ' open' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <SectionTransition zIndex={10} glass={false} entrance={false}>
        <Hero loaded={loaded} themeMode={themeMode} />
      </SectionTransition>
      
      <Marquee />

      <SectionInterstitial 
        mode="scramble"
        tag="[ SYSTEM INDEX ]" 
        title="WHO?" 
        sub="01 — AADIY KHAN" 
        diag="STATUS: READY // RESEARCH MODE" 
      />
      <SectionTransition zIndex={20}>
        <About />
      </SectionTransition>

      <SectionInterstitial 
        mode="slice"
        tag="[ ARCHITECTURE ]" 
        title="WORK." 
        sub="02 — SELECTED SYSTEMS" 
        diag="RECORD_COUNT: 2.5M+ // LIVE" 
      />
      <SectionTransition zIndex={30}>
        <Projects data={data.projects} />
      </SectionTransition>

      <SectionInterstitial 
        mode="curtain"
        tag="[ EXPERIENCE ]" 
        title="IMPACT." 
        sub="03 — DEFENCE & ENTERPRISE" 
        diag="SECURITY CLEARANCE: ACTIVE" 
      />
      <SectionTransition zIndex={40}>
        <Experience data={data.experience} />
      </SectionTransition>

      <SectionInterstitial 
        mode="tunnel"
        tag="[ MILESTONES ]" 
        title="PATH." 
        sub="04 — 2022 TO 2026" 
        diag="TIMELINE_INDEX: ACTIVE" 
      />
      <Timeline data={data.timeline} />

      <SectionInterstitial 
        mode="matrix"
        tag="[ METRICS ]" 
        title="DATA." 
        sub="05 — TELEMETRY & REPOS" 
        diag="API_STATUS: SYNCED" 
      />
      <SectionTransition zIndex={60}>
        <Stats themeMode={themeMode} />
      </SectionTransition>

      <SectionTransition zIndex={70}>
        <CRTTerminal />
      </SectionTransition>

      <SectionTransition zIndex={80}>
        <Contact />
      </SectionTransition>
      
      <Footer scrollTo={scrollTo} />
      {showDinoGame && <DinoGame onClose={() => setShowDinoGame(false)} />}
    </>
  );
}
