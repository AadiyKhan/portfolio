import React, { useEffect, useState } from 'react';

export default function ShootingStars() {
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    // Generate subtle, natural white background stars
    const rows = 14;
    const cols = 16;
    const newStars = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.2) continue; // Natural distribution
        
        const size = Math.random() * 1.4 + 0.8; // 0.8px to 2.2px (subtle)

        newStars.push({
          id: `${r}-${c}-${Math.random()}`,
          x: (c * (100 / cols)) + Math.random() * (100 / cols), // %
          y: (r * (100 / rows)) + Math.random() * (100 / rows), // %
          size,
          animationDuration: Math.random() * 3 + 2.5, // 2.5s to 5.5s (gentle)
          animationDelay: Math.random() * 5, // 0s to 5s
        });
      }
    }
    setStars(newStars);

    // Shooting star generator (occasional, elegant)
    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        const id = Date.now() + Math.random();
        const startX = 35 + Math.random() * 60; // 35% to 95%
        const startY = Math.random() * 35; // 0% to 35%
        const duration = 0.9 + Math.random() * 0.7; // 0.9s to 1.6s
        const width = 140 + Math.random() * 80; // 140px to 220px

        const newMeteor = { id, x: startX, y: startY, duration, width };

        setMeteors((prev) => [...prev.slice(-2), newMeteor]); // Max 3 at a time

        setTimeout(() => {
          setMeteors((prev) => prev.filter((m) => m.id !== id));
        }, duration * 1000 + 100);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sky-container">
      {/* Background Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="twinkle-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.animationDuration}s`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}
      
      {/* Shooting Meteors */}
      {meteors.map((m) => (
        <div 
          key={m.id}
          className="meteor"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: `${m.width}px`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
