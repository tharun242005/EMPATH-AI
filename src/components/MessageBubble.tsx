import { motion } from 'motion/react';
import { User, Bot, Sparkles } from 'lucide-react';
import { EmotionBadge } from './EmotionBadge';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  emotion?: string;
  severity?: number;
  webEnabled?: boolean;
}

export function MessageBubble({ message, isUser, timestamp, emotion, severity, webEnabled }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const renderedMessage = useMemo(() => {
    // Make IPC sections clickable: 354A, 354D, 499, 503, 504, 506, 509
    const pattern = /\b(?:IPC\s*)?(?:Section\s*)?(354A|354D|499|503|504|506|509)\b/gi;
    const nodes: Array<JSX.Element | string> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(message)) !== null) {
      const start = match.index;
      const end = pattern.lastIndex;
      if (start > lastIndex) nodes.push(message.slice(lastIndex, start));
      const matchedText = message.slice(start, end);
      nodes.push(
        <Link
          key={`${matchedText}-${start}`}
          to="/legal"
          className="text-[#4B3F72] underline underline-offset-2 decoration-dotted hover:text-[#6C4B8C] font-medium"
          title="View legal resources"
        >
          {matchedText}
        </Link>
      );
      lastIndex = end;
    }
    if (lastIndex < message.length) nodes.push(message.slice(lastIndex));
    return nodes;
  }, [message]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? (isUser ? -5 : 5) : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser ? 'bg-gradient-to-br from-[#FFB6A3] to-[#FFE6A7]' : 'bg-gradient-to-br from-[#4B3F72] to-[#6C4B8C]'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>
      
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Emotion badges hidden from user view - used only for backend processing */}
        
        <motion.div
          whileHover={{ 
            scale: 1.02,
            boxShadow: isUser 
              ? "0 10px 40px rgba(255, 182, 163, 0.3)" 
              : "0 10px 40px rgba(75, 63, 114, 0.2)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={`relative px-4 py-3 rounded-2xl overflow-hidden ${
            isUser
              ? 'bg-gradient-to-br from-[#FFB6A3] to-[#FFE6A7] text-gray-800'
              : 'glass-card shadow-md'
          }`}
        >
          {/* Shimmer effect for AI messages */}
          {!isUser && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
                repeatDelay: 5
              }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            />
          )}
          
          {/* Sparkle effect on hover */}
          {isHovered && !isUser && (
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 180 }}
              exit={{ scale: 0, rotate: 360 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-4 h-4 text-[#FFE6A7]" />
            </motion.div>
          )}
          
          <div className="flex items-start gap-2 relative z-10">
            <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
              {renderedMessage}
            </p>
            {webEnabled && !isUser && (
              <span 
                className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-medium"
                title="This response used live web search"
              >
                🌐 Online
              </span>
            )}
          </div>
        </motion.div>
        
        {timestamp && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-gray-500 mt-1 px-2"
          >
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}