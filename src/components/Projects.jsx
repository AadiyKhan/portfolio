import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { PROJECT_IMAGES } from '../data/constants';
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
export default Projects;