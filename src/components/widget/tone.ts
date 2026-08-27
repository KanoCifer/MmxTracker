import type { Tone } from './types';

/**
 * Map a 0–100 usage percentage to a 4-level color tier.
 * The thresholds are intentional: anything below 70% reads as "still
 * comfortable"; 70%+ is where 5h-window resets actually start to pinch.
 */
export function pickTone(usedPct: number): Tone {
  if (usedPct >= 90) return 'red';
  if (usedPct >= 70) return 'ember';
  if (usedPct >= 40) return 'amber';
  return 'mint';
}

/**
 * Tailwind class strings keyed by tone. Kept as a constant object so
 * Tailwind's source scanner can pick them up at build time.
 */
export const TONE_FILL_CLASS: Record<Tone, string> = {
  mint: 'bg-mint',
  amber: 'bg-amber',
  ember: 'bg-ember',
  red: 'bg-red',
};

/** The small indicator dot that carries the tier color on the collapsed chip. */
export const TONE_DOT_CLASS: Record<Tone, string> = {
  mint: 'bg-mint',
  amber: 'bg-amber',
  ember: 'bg-ember',
  red: 'bg-red',
};

/** Tailwind class strings for a fill bar, keyed by tone. */
export const TONE_TEXT_CLASS: Record<Tone, string> = {
  mint: 'text-mint',
  amber: 'text-amber',
  ember: 'text-ember',
  red: 'text-red',
};
