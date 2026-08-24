import { useEffect, useRef } from 'react';

export function ParticleWaves() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${10 + Math.random() * 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 20000);
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    // Create new particles periodically
    const interval = setInterval(createParticle, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="particle-waves" />;
}
