import { useRef } from 'react';
import { motion } from 'motion/react';
import { MascotImage } from './MascotImage';
import { TONE_DOT_CLASS } from './tone';
import type { Tone } from './types';

const TAP_SLOP_PX = 5;

interface Props {
  worstUsedPct: number;
  tone: Tone;
  onExpand: () => void;
}

export function RiskChip({ worstUsedPct, tone, onExpand }: Props) {
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  return (
    <motion.div
      layoutId="float-widget"
      exit={{ opacity: 0 }}
      whileHover={{ x: -16, transition: { type: 'spring', stiffness: 320, damping: 26 } }}
      drag
      className="border-line bg-surface group fixed -right-4 bottom-4 flex h-14 w-fit cursor-grab items-center rounded-full border shadow-[0_10px_28px_-8px_rgba(0,0,0,0.55)]"
    >
      <button
        type="button"
        onPointerDown={(e) => {
          pressStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = pressStart.current;
          pressStart.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (dx * dx + dy * dy <= TAP_SLOP_PX * TAP_SLOP_PX) {
            onExpand();
          }
        }}
        onPointerCancel={() => {
          pressStart.current = null;
        }}
        aria-label={tone === 'red' ? '令牌消耗接近上限，展开查看' : '展开令牌消耗'}
        className="flex h-14 cursor-pointer items-center"
      >
        {/* Risk capsule — the glow washes with the tone so the color reads first. */}
        <span
          aria-hidden
          className="border-line bg-surface group-hover:border-line2 flex h-14 items-center gap-1.5 rounded-l-full border py-0 pr-3 pl-4 transition-colors"
        >
          <span aria-hidden className={`h-2 w-2 rounded-full ${TONE_DOT_CLASS[tone]}`} />
          <span
            className={`font-mono text-[15px] font-semibold tabular-nums ${tone === 'red' ? 'text-red' : 'text-ink'}`}
          >
            {worstUsedPct.toFixed(0)}%
          </span>
        </span>

        {/* The mascot button lives to the right of the capsule. */}
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <motion.div
            aria-hidden
            className={`absolute inset-0 rounded-full ${tone === 'red' ? 'bg-red/20' : 'bg-ember/15'}`}
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.25, 0.5] }}
            transition={{ duration: tone === 'red' ? 2 : 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Chevron hint — points left toward the page so users see this is
              the "hidden" affordance that comes back from the edge. */}
          <span aria-hidden className="text-ink3 absolute top-1/2 left-1 -translate-y-1/2 text-[10px] leading-none">
            ‹
          </span>
          <MascotImage refreshing={false} size={42} />
        </span>
      </button>
    </motion.div>
  );
}
