import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { GitHubCalendar } from 'react-github-calendar';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, ContactShadows } from '@react-three/drei';
import './index.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SKILLS = [
  'PyTorch', '◆', 'TensorFlow', '◆', 'Transformers', '◆', 'Computer Vision', '◆',
  'NLP', '◆', 'Docker', '◆', 'Kafka', '◆', 'Python', '◆', 'React', '◆',
  'Node.js', '◆', 'Git', '◆', 'Linux', '◆', 'MLOps', '◆', 'Deep Learning', '◆',
  'GANs', '◆', 'BERT', '◆', 'OpenCV', '◆', 'Scikit-learn', '◆',
];

const PROJECT_IMAGES = {
  'Transformer From Scratch': '/images/transformer.png',
  'NADS — Anomaly Detection': '/images/nads.png',
  'FlowBERT': '/images/flowbert.png',
};

const ASCII_ART = [
  '  █████╗  █████╗ ██████╗ ██╗██╗   ██╗',
  ' ██╔══██╗██╔══██╗██╔══██╗██║╚██╗ ██╔╝',
  ' ███████║███████║██║  ██║██║ ╚████╔╝ ',
  ' ██╔══██║██╔══██║██║  ██║██║  ╚██╔╝  ',
  ' ██║  ██║██║  ██║██████╔╝██║   ██║   ',
  ' ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   ',
];

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

  const toggleTheme = () => {
    if (themeMode === 'light') {
      document.documentElement.removeAttribute('data-theme');
      setThemeMode('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setThemeMode('light');
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.body.scrollHeight;
      const ratio = y / h;

      if (orbARef.current) {
        orbARef.current.style.transform = `translate(${ratio * 40}vw, ${ratio * 30}vh) scale(${1 + ratio})`;
      }
      if (orbBRef.current) {
        orbBRef.current.style.transform = `translate(${-ratio * 30}vw, ${-ratio * 20}vh) scale(${1 + ratio * 0.5})`;
      }
      if (orbCRef.current) {
        orbCRef.current.style.transform = `translate(${ratio * 20}vw, ${ratio * 40}vh) rotate(${ratio * 180}deg)`;
      }
      if (watermarkRef.current) {
        watermarkRef.current.style.transform = `translateX(${-ratio * 50}vw)`;
      }
      if (watermarkRef2.current) {
        watermarkRef2.current.style.transform = `translateX(${ratio * 50 - 30}vw)`;
      }
      
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

  return (
    <>
      <div className="gradient-bg">
        <div className="mesh-orb orb-a" ref={orbARef} />
        <div className="mesh-orb orb-b" ref={orbBRef} />
        <div className="mesh-orb orb-c" ref={orbCRef} />
      </div>
      <div className="grid-overlay" />
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
    if (!loaded) return;
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
      <div id="lanyard-pivot" ref={dropRef} style={{ position: 'absolute', top: -50, right: '15%', width: 320, zIndex: 50, pointerEvents: 'none', transform: 'translateY(-1500px)' }}>
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
    if (!loaded) return;
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(el.querySelectorAll('.hero-name'), {
      y: '0%', duration: 1, stagger: 0.15, ease: 'power3.out',
    });
    tl.to(el.querySelector('.hero-tagline'), {
      y: '0%', duration: 0.6, ease: 'power3.out',
    }, '-=0.5');
    tl.to(el.querySelector('.hero-desc'), {
      y: '0%', duration: 0.6, ease: 'power3.out',
    }, '-=0.3');
    tl.to(el.querySelectorAll('.hero-actions > *'), {
      y: '0%', duration: 0.5, stagger: 0.1, ease: 'power3.out',
    }, '-=0.2');
  }, { scope: ref, dependencies: [loaded] });

  return (
    <section className="sect hero" id="home" ref={ref}>
      
      <div style={{ position: 'relative', zIndex: 1, width: '50%', minWidth: '300px' }}>
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

/* ═══ PROJECT SHADER ═══ */
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHover;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    uv.y += sin(uv.x * 10.0 + uHover * 5.0) * 0.05 * uHover;
    uv.x += sin(uv.y * 10.0 + uHover * 5.0) * 0.05 * uHover;
    gl_FragColor = texture2D(uTexture, uv);
  }
`;

function ProjectImage({ url }) {
  const { viewport } = useThree();
  const mesh = useRef();
  const hover = useRef(0);
  const texture = useLoader(THREE.TextureLoader, url);
  
  useFrame((state, delta) => {
    mesh.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(
      mesh.current.material.uniforms.uHover.value,
      hover.current,
      0.1
    );
  });

  return (
    <mesh ref={mesh} onPointerOver={() => hover.current = 1} onPointerOut={() => hover.current = 0}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uHover: { value: 0 }
        }}
      />
    </mesh>
  );
}

/* ═══ ABOUT ═══ */
function About() {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    
    gsap.fromTo(el.querySelector('.sect-heading'), 
      { opacity: 0, y: 60 },
      { scrollTrigger: { trigger: el, start: 'top 85%' }, opacity: 1, y: 0, duration: 1, ease: 'expo.out' }
    );
    
    gsap.fromTo(el.querySelectorAll('.reveal'),
      { y: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: ref });

  return (
    <section className="sect sect-about" id="about" ref={ref}>
      <p className="sect-label reveal">01 — About</p>
      <h2 className="sect-heading reveal gradient-text-1">
        Not your typical <em className="serif">CS student.</em>
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

/* ═══ PROJECTS (HORIZONTAL PIN SCROLL) ═══ */
function Projects({ data }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!track || !section) return;

    // Pinning the whole section for horizontal scroll
    const totalScroll = track.scrollWidth - window.innerWidth + 96;
    
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true,
      animation: gsap.to(track, { x: () => -totalScroll, ease: 'none' }),
    });

    gsap.fromTo('.project-card',
      { y: 60, opacity: 0 },
      { scrollTrigger: { trigger: section, start: 'top 60%' }, y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
    );
  }, { dependencies: [data] });

  return (
    <section className="projects-pin" id="projects" ref={sectionRef}>
      <div className="projects-header">
        <p className="sect-label">02 — Work</p>
        <h2 className="sect-heading gradient-text-2">Selected <em className="serif">projects.</em></h2>
      </div>
      <div className="projects-track" ref={trackRef}>
        {data.map((proj, i) => (
          <div className="project-card" key={i}>
            <div className="project-thumb">
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ width: '100%', height: '100%' }}>
                <Suspense fallback={null}>
                  <ProjectImage url={PROJECT_IMAGES[proj.name] || '/images/transformer.png'} />
                </Suspense>
              </Canvas>
            </div>
            <div className="project-body">
              <p className="project-status">{proj.status}</p>
              <h3 className="project-name">{proj.name}</h3>
              <p className="project-desc">{proj.desc}</p>
              <div className="project-chips">
                {proj.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
              </div>
              <div className="project-links">
                {proj.links.map((l) => (
                  <a href={l.url} className="project-link" key={l.label} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══ EXPERIENCE ═══ */
function Experience({ data }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    
    gsap.fromTo(el.querySelector('.sect-heading'),
      { opacity: 0, y: 40 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(el.querySelectorAll('.reveal'),
      { y: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
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

/* ═══ TIMELINE ═══ */
function Timeline({ data }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;

    gsap.fromTo(el.querySelector('.sect-heading'),
      { opacity: 0, x: -30 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(el.querySelectorAll('.tl-item'),
      { x: -30, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 75%' }, x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: ref, dependencies: [data] });

  return (
    <section className="sect sect-journey" id="journey" ref={ref}>
      <p className="sect-label">04 — Journey</p>
      <h2 className="sect-heading">The <em className="serif">path</em> so far.</h2>
      <div className="timeline">
        {data.map((t, i) => (
          <div className="tl-item" key={i}>
            <p className="tl-year">{t.year}</p>
            <h4 className="tl-title">{t.title}</h4>
            <p className="tl-desc">{t.desc}</p>
          </div>
        ))}
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
      { y: 40, opacity: 0 },
      { scrollTrigger: { trigger: el, start: 'top 80%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
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
      { type: 'success', text: 'Email: aadiykhan.work@gmail.com' },
      { type: 'success', text: 'GitHub: github.com/AadiyKhan' },
      { type: 'success', text: 'LinkedIn: linkedin.com/in/aadiy-khan' },
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
  const [form, setForm] = useState({ name: '', email: '', message: '' });
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
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
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
            <a href="mailto:aadiykhan.work@gmail.com">→ aadiykhan.work@gmail.com</a>
            <a href="https://github.com/AadiyKhan" target="_blank" rel="noopener noreferrer">→ github.com/AadiyKhan</a>
            <a href="https://linkedin.com/in/aadiy-khan" target="_blank" rel="noopener noreferrer">→ linkedin.com/in/aadiy-khan</a>
          </div>
        </div>
        <form className="form-stack reveal" onSubmit={submit}>
          {sent ? (
            <div style={{ padding: '40px 0', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--cyan)' }}>
              Message sent. I'll be in touch. ✓
            </div>
          ) : (
            <>
              <div className="form-field">
                <label>Name</label>
                <input type="text" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Message</label>
                <textarea placeholder="What's on your mind?" value={form.message}
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

/* ═══ FOOTER ═══ */
function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 Aadiy Khan</span>
      <div className="footer-links">
        <a href="https://github.com/AadiyKhan" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/aadiy-khan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:aadiykhan.work@gmail.com">Email</a>
      </div>
    </footer>
  );
}

/* ═══ PIXEL CAT ═══ */
const PixelCat = () => (
  <div className="pixel-cat">
    <svg viewBox="0 0 16 16" width="32" height="32">
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

/* ═══════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [sweep, setSweep] = useState(null);

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
    fetch('/api/portfolio-data')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {
        import('../data/portfolio.json').then((m) => setData(m.default));
      });
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

      <nav className="nav">
        <div className="nav-logo" onClick={() => scrollTo('home')}>AK.</div>
        <ul className="nav-links">
          {['about', 'projects', 'experience', 'journey', 'terminal'].map((s) => (
            <li key={s}><a onClick={() => scrollTo(s)}>{s}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <PixelCat />
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {themeMode === 'light' ? '🌙' : '☀️'}
          </button>
          <Magnetic>
            <button className="nav-cta" onClick={() => scrollTo('contact')}>Contact</button>
          </Magnetic>
        </div>
      </nav>

      <Hero loaded={loaded} themeMode={themeMode} />
      <Marquee />
      <About />
      <Projects data={data.projects} />
      <Experience data={data.experience} />
      <Timeline data={data.timeline} />
      <Stats themeMode={themeMode} />
      <CRTTerminal />
      <Contact />
      <Footer />
    </>
  );
}
