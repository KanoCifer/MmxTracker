import { useState } from 'react';
import { motion } from 'motion/react';
import { MascotImage } from './MascotImage';

interface Props {
  refreshing: boolean;
  onCollapse: () => void;
}

export function MascotBadge({ refreshing, onCollapse }: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={onCollapse}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-label="收起"
      draggable={false}
      initial={{ y: -10, opacity: 0 }}
      animate={{ opacity: 1, y: [0, -2, 0] }}
      exit={{ y: -10, opacity: 0 }}
      transition={{
        opacity: { duration: 0.25 },
        y: { duration: 3.2, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' as const },
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="absolute -top-7 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full"
    >
      <MascotImage refreshing={refreshing} size={40} />
      <motion.span
        role="tooltip"
        aria-hidden={!hovered}
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 4,
        }}
        transition={{ duration: 0.18, ease: 'easeOut', delay: hovered ? 0.25 : 0 }}
        className="border-line bg-surface2 text-ink2 pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md border px-2 py-1 text-[11px] whitespace-nowrap shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]"
      >
        点击收起
      </motion.span>
    </motion.button>
  );
}
