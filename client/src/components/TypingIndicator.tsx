import { Bot } from 'lucide-react';
import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-3 mb-4"
    >
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#6C4B8C] flex items-center justify-center shadow-lg"
      >
        <Bot className="w-5 h-5 text-white" />
      </motion.div>
      
      <div className="glass-card px-4 py-3 rounded-2xl shadow-md relative overflow-hidden">
        {/* Animated background pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-r from-[#4B3F72]/10 to-[#6C4B8C]/10"
        />
        
        <div className="flex gap-1 relative z-10">
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.4,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#6C4B8C]"
          />
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.4,
              delay: 0.2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#6C4B8C]"
          />
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.4,
              delay: 0.4,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#6C4B8C]"
          />
        </div>
      </div>
    </motion.div>
  );
}