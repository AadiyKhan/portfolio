import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Magnetic, LanyardCard } from './UI';
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
export default Hero;
