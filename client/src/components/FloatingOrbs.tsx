import { motion } from 'motion/react';

export function FloatingOrbs() {
  const orbs = [
    { size: 300, color: '#4B3F72', delay: 0, duration: 20, x: '10%', y: '20%' },
    { size: 400, color: '#5D8AA8', delay: 2, duration: 25, x: '80%', y: '60%' },
    { size: 250, color: '#FFE6A7', delay: 4, duration: 18, x: '50%', y: '80%' },
    { size: 350, color: '#C27691', delay: 1, duration: 22, x: '20%', y: '70%' },
    { size: 200, color: '#6C4B8C', delay: 3, duration: 19, x: '70%', y: '30%' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent)`,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
