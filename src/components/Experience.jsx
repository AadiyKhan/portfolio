import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
export default Experience;