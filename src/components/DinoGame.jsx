import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function DinoGame({ onClose }) {
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('dinoHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  useGSAP(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    }
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.88, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' }
      );
    }
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    if (modalRef.current) {
      tl.to(modalRef.current, { scale: 0.88, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' }, 0);
    }
    if (overlayRef.current) {
      tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, 0);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 150;

    let animationId;
    let isJumping = false;
    const GRAVITY = 0.55;
    const JUMP_STRENGTH = -9.5;
    const FLOOR_Y = 110; // Feet touch 132px ground line
    
    let cat = { x: 50, y: FLOOR_Y, width: 32, height: 32, velocityY: 0 };
    let obstacles = [];
    let particles = [];
    let frameCount = 0;
    let currentScore = 0;
    let gameIsOver = false;
    let gameSpeed = 4.2;
    let lastTime = performance.now();
    let spawnTimer = 45;

    const spawnObstacle = () => {
      const typeRand = Math.random();
      if (typeRand > 0.65 && currentScore > 50) {
        // Flying Bird / Drone
        obstacles.push({
          type: 'bird',
          x: canvas.width,
          y: Math.random() > 0.5 ? 65 : 85,
          width: 22,
          height: 16,
        });
      } else {
        // Ground Cactus
        const isTall = Math.random() > 0.5;
        obstacles.push({
          type: 'ground',
          x: canvas.width,
          y: isTall ? 95 : 105,
          width: isTall ? 22 : 18,
          height: isTall ? 37 : 27,
        });
      }
    };

    const triggerJump = () => {
      if (gameIsOver) {
        // Reset Game State
        cat.y = FLOOR_Y;
        cat.velocityY = 0;
        obstacles = [];
        particles = [];
        frameCount = 0;
        currentScore = 0;
        gameSpeed = 4.2;
        gameIsOver = false;
        setGameOver(false);
        setScore(0);
        lastTime = performance.now();
        spawnTimer = 45;
      } else if (!isJumping) {
        isJumping = true;
        cat.velocityY = JUMP_STRENGTH;
        // Jump dust particles
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: cat.x + 8 + Math.random() * 12,
            y: FLOOR_Y + 20,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -Math.random() * 1.5,
            life: 1.0
          });
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      }
    };

    const handlePointerDown = (e) => {
      if (e.target.closest('.dino-close-btn')) return;
      e.preventDefault();
      triggerJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    const modalEl = modalRef.current;
    if (modalEl) modalEl.addEventListener('pointerdown', handlePointerDown);

    const checkCollision = (obs) => {
      const catHitbox = { 
        x: cat.x + 6, 
        y: cat.y + 6, 
        w: 20, 
        h: 20 
      };

      const obsHitbox = { 
        x: obs.x + 3, 
        y: obs.y + 3, 
        w: obs.width - 6, 
        h: obs.height - 6 
      };

      return (
        catHitbox.x < obsHitbox.x + obsHitbox.w &&
        catHitbox.x + catHitbox.w > obsHitbox.x &&
        catHitbox.y < obsHitbox.y + obsHitbox.h &&
        catHitbox.y + catHitbox.h > obsHitbox.y
      );
    };

    const update = (dt) => {
      if (gameIsOver) return;
      const m = dt / 16.66;

      // Physics
      cat.velocityY += GRAVITY * m;
      cat.y += cat.velocityY * m;

      // Floor collision
      if (cat.y >= FLOOR_Y) {
        cat.y = FLOOR_Y;
        cat.velocityY = 0;
        isJumping = false;
      }

      // Particles update
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * m;
        p.y += p.vy * m;
        p.life -= 0.05 * m;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Obstacles update
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed * m;

        if (checkCollision(obstacles[i])) {
          gameIsOver = true;
          setGameOver(true);
          setHighScore((prev) => {
            if (currentScore > prev) {
              const newHi = Math.floor(currentScore);
              localStorage.setItem('dinoHighScore', newHi);
              return newHi;
            }
            return prev;
          });
        }
      }

      obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

      spawnTimer -= m;
      if (spawnTimer <= 0 && obstacles.length < 3) {
        spawnObstacle();
        spawnTimer = 55 + Math.random() * 55;
      }

      currentScore += 0.15 * m;
      setScore(Math.floor(currentScore));

      gameSpeed += 0.0008 * m;
      frameCount += m;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const fgColor = isLight ? '#000000' : '#ffffff';
      const cyanColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff5f1f';

      // Draw Floor line
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 132);
      ctx.lineTo(canvas.width, 132);
      ctx.stroke();

      // Draw Particles
      ctx.fillStyle = cyanColor;
      particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 2, 2);
      });
      ctx.globalAlpha = 1.0;

      // Draw Pixel Cat
      ctx.fillStyle = fgColor;
      ctx.save();
      const scale = cat.width / 16;
      ctx.translate(cat.x, cat.y);
      ctx.scale(scale, scale);
      
      ctx.beginPath();
      const isWalkFrame2 = !isJumping && Math.floor(frameCount / 8) % 2 === 0;

      if (isJumping) {
        // Tucked Jump Pose
        ctx.rect(10, 3, 1, 1);
        ctx.rect(13, 3, 1, 1);
        ctx.rect(10, 4, 4, 3);
        ctx.rect(3, 5, 7, 3);
        ctx.rect(1, 4, 2, 1);
        ctx.rect(4, 8, 2, 2);
        ctx.rect(9, 8, 2, 2);
      } else if (isWalkFrame2) {
        // Walk Frame A
        ctx.rect(10, 4, 1, 1);
        ctx.rect(13, 4, 1, 1);
        ctx.rect(10, 5, 4, 3);
        ctx.rect(3, 6, 7, 3);
        ctx.rect(1, 5, 2, 1);
        ctx.rect(5, 9, 1, 2);
        ctx.rect(7, 9, 1, 2);
        ctx.rect(12, 8, 1, 2);
      } else {
        // Walk Frame B
        ctx.rect(10, 4, 1, 1);
        ctx.rect(13, 4, 1, 1);
        ctx.rect(10, 5, 4, 3);
        ctx.rect(3, 6, 7, 3);
        ctx.rect(2, 5, 1, 2);
        ctx.rect(4, 9, 1, 2);
        ctx.rect(8, 9, 1, 2);
        ctx.rect(11, 8, 1, 2);
      }
      ctx.fill();
      ctx.restore();

      // Draw Obstacles
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.type === 'bird') {
          ctx.fillStyle = cyanColor;
          const wingUp = Math.floor(frameCount / 10) % 2 === 0;
          ctx.fillRect(obs.x + 4, obs.y + 4, 14, 6);
          ctx.fillRect(obs.x + 18, obs.y + 2, 4, 4);
          if (wingUp) {
            ctx.fillRect(obs.x + 8, obs.y - 4, 6, 8);
          } else {
            ctx.fillRect(obs.x + 8, obs.y + 6, 6, 8);
          }
        } else {
          ctx.fillStyle = cyanColor;
          ctx.fillRect(obs.x + 6, obs.y, 8, obs.height);
          ctx.fillRect(obs.x, obs.y + 10, 6, 4);
          ctx.fillRect(obs.x, obs.y + 2, 4, 12);
          ctx.fillRect(obs.x + 14, obs.y + 14, 6, 4);
          ctx.fillRect(obs.x + 16, obs.y + 6, 4, 12);
        }
      }

      // Draw Game Over Overlay
      if (gameIsOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff5f56';
        ctx.font = 'bold 22px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 12);

        ctx.font = '13px "Space Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TAP OR PRESS SPACE TO RESTART', canvas.width / 2, canvas.height / 2 + 16);
      }
    };

    const loop = (time) => {
      const dt = Math.min(time - lastTime, 32);
      lastTime = time;
      update(dt);
      draw();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (modalEl) modalEl.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const preventScroll = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') e.preventDefault();
    };
    window.addEventListener('keydown', preventScroll, { passive: false });
    return () => window.removeEventListener('keydown', preventScroll);
  }, []);

  return (
    <div className="dino-game-overlay" ref={overlayRef}>
      <div className="dino-game-modal" ref={modalRef}>
        <button 
          className="dino-close-btn" 
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          aria-label="Close Game"
        >
          ×
        </button>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
          <div className="dino-score">
            HI {String(Math.max(highScore, 0)).padStart(5, '0')} <span>{String(Math.floor(score)).padStart(5, '0')}</span>
          </div>
        </div>
        <canvas ref={canvasRef} className="dino-canvas" />
        <div className="dino-instructions">
          {gameOver ? 'TAP OR SPACE TO PLAY AGAIN' : 'TAP OR SPACE TO JUMP'}
        </div>
      </div>
    </div>
  );
}
