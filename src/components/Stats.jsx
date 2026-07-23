import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { GitHubCalendar } from 'react-github-calendar';
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
export default Stats;