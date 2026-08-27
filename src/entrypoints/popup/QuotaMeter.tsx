import { TONE_FILL_CLASS, pickTone } from '@/lib/tone';
import type { ModelSignal } from '@/lib/types';

function ModelRow({ m }: { m: ModelSignal }) {
  const fillColor = TONE_FILL_CLASS[pickTone(m.usedPct)];
  return (
    <div className="py-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-ink truncate text-xs font-medium">{m.name}</span>
        <span className={`shrink-0 font-mono text-[11px] tabular-nums ${m.statusClassName}`}>
          {m.usedPct.toFixed(0)}%
        </span>
      </div>
      <div className="bg-surface2 h-1.5 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${fillColor} transition-[width] duration-300 ease-out`}
          style={{ width: `${m.usedPct}%` }}
        />
      </div>
      <div className="text-ink3 mt-1 flex items-baseline justify-between text-[10px]">
        <span>每 5h 刷新</span>
        <span className="font-mono tabular-nums">{m.remainingText}</span>
      </div>
    </div>
  );
}

/** Quota section: title + reset window, then one row per model. */
export function QuotaMeter({ models }: { models: ModelSignal[] }) {
  if (!models.length) return null;
  return (
    <section className="mt-4">
      <div className="divide-line/60 divide-y">
        {models.map((m) => (
          <ModelRow key={m.name} m={m} />
        ))}
      </div>
    </section>
  );
}
