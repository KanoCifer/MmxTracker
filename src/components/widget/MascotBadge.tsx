import { motion } from 'motion/react';
import { MascotImage } from './MascotImage';
import type { Tone } from './types';

/**
 * The mascot round badge — used inside ExpandedPanel, sitting above the
 * panel so it can be clicked to collapse the widget.
 *
 * Composition:
 *  - Outer <motion.button>: floating bob + click target. Click bubbles only
 *    to itself; the parent pill never receives onClick so drag/click
 *    arbitration is unambiguous.
 *  - Halo <motion.div>: pulsing ember wash; accelerates on the danger tier.
 *  - <MascotImage>: the actual PNG with the head-tick animation.
 *
 * NOTE: opacity 0 → 1 is split out from the y keyframe so motion doesn't
 * collapse both into a single keyframe set (a known footgun).
 */
interface Props {
  tone: Tone;
  refreshing: boolean;
  onCollapse: () => void;
}

export function MascotBadge({ tone, refreshing, onCollapse }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onCollapse}
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
      className="border-line bg-surface absolute -top-7 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]"
    >
      <motion.div
        aria-hidden
        className={`absolute inset-0 rounded-full ${tone === 'red' ? 'bg-red/20' : 'bg-ember/15'}`}
        animate={
          tone === 'red'
            ? { scale: [1, 1.2, 1], opacity: [0.6, 0.15, 0.6] }
            : { scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }
        }
        transition={{ duration: tone === 'red' ? 1.4 : 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MascotImage refreshing={refreshing} size={40} />
    </motion.button>
  );
}
