import { TONE_FILL_CLASS, TONE_TEXT_CLASS, pickTone } from './tone';
import type { ModelSignal } from './types';

/**
 * One model's 5h-window quota row inside the expanded panel.
 * Low fill (much remaining) reads safer in mint; near the cap it tips to
 * ember/red. Unlimited models hide their used% bar entirely — there's no
 * denominator to judge against.
 */
export function ModelUsageRow({ m }: { m: ModelSignal }) {
  const fillColor = TONE_FILL_CLASS[pickTone(m.usedPct)];
  const labelColor = m.unlimited ? 'text-ink3' : TONE_TEXT_CLASS[pickTone(m.usedPct)];

  return (
    <div className="py-1.5">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-medium text-ink">{m.name}</span>
        <span className={`shrink-0 font-mono text-[11px] tabular-nums ${labelColor}`}>
          {m.unlimited ? '不限' : `${m.usedPct.toFixed(0)}%`}
        </span>
      </div>
      {!m.unlimited && (
        <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
          <div
            className={`h-full rounded-full ${fillColor} transition-[width] duration-300 ease-out`}
            style={{ width: `${m.usedPct}%` }}
          />
        </div>
      )}
      <div className="mt-1 flex items-baseline justify-between text-[10px] text-ink3">
        <span>{m.statusText} · 每 5h 刷新</span>
        <span className="font-mono tabular-nums">{m.remainingText}</span>
      </div>
    </div>
  );
}
