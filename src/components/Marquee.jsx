import React from 'react';
import { SKILLS } from '../data/constants';
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
export default Marquee;