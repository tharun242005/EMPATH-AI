import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface EmotionParticlesProps {
  emotion: string;
}

export function EmotionParticles({ emotion }: EmotionParticlesProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Emotion color mapping
  const emotionColors: Record<string, string[]> = {
    happy: ['#10b981', '#3b82f6', '#8b5cf6'],
    sad: ['#3b82f6', '#6366f1', '#8b5cf6'],
    angry: ['#ef4444', '#f97316', '#fb923c'],
    fearful: ['#f97316', '#fbbf24', '#ef4444'],
    anxious: ['#fbbf24', '#f97316', '#ef4444'],
    hopeful: ['#10b981', '#14b8a6', '#3b82f6'],
    calm: ['#8b5cf6', '#3b82f6', '#ec4899'],
    distressed: ['#ef4444', '#ec4899', '#8b5cf6'],
    neutral: ['#6b7280', '#9ca3af', '#d1d5db'],
  };

  const colors = emotionColors[emotion] || emotionColors.calm;

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, [emotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={`${emotion}-${particle.id}`}
          initial={{ 
            x: `${particle.x}vw`, 
            y: `${particle.y}vh`,
            scale: 0,
            opacity: 0 
          }}
          animate={{
            x: [`${particle.x}vw`, `${particle.x + (Math.random() - 0.5) * 20}vw`],
            y: [`${particle.y}vh`, `${particle.y + (Math.random() - 0.5) * 20}vh`],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors[index % colors.length]}80, transparent)`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}
