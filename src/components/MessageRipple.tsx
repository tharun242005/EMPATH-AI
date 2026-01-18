import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface MessageRippleProps {
  trigger: number; // Increment this to trigger animation
}

export function MessageRipple({ trigger }: MessageRippleProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="absolute w-40 h-40 rounded-full border-2 border-[#4B3F72]/30"
            />
          ))}
          
          {/* Center pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#4B3F72]/40 to-[#6C4B8C]/40"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
