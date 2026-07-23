import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
export { SplitWordReveal, SectionTransition, SectionInterstitial, Preloader, Cursor, ScrollProgress, Magnetic, AnimatedBG, PixelAvatarSVG, LanyardCard };
