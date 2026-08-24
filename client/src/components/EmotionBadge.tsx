import { motion } from 'motion/react';

interface EmotionBadgeProps {
  emotion: string;
  severity?: number;
}

const emotionConfig: Record<string, { emoji: string; color: string; bgColor: string }> = {
  happy: { emoji: '😊', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  sad: { emoji: '😢', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  angry: { emoji: '😠', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  fearful: { emoji: '😰', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
  anxious: { emoji: '😟', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' },
  hopeful: { emoji: '🌟', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  calm: { emoji: '😌', color: '#5D8AA8', bgColor: 'rgba(93, 138, 168, 0.1)' },
  distressed: { emoji: '💔', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
  neutral: { emoji: '😐', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
};

export function EmotionBadge({ emotion, severity }: EmotionBadgeProps) {
  const config = emotionConfig[emotion.toLowerCase()] || emotionConfig.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    >
      <span className="text-base">{config.emoji}</span>
      <span className="capitalize font-medium">{emotion}</span>
      {severity !== undefined && (
        <span className="opacity-70 text-xs">
          • Severity {severity}/5
        </span>
      )}
    </motion.div>
  );
}
