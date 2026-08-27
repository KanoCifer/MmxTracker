import { clampPercent, formatRemaining, percentOf } from '@/lib/format';
import { statusLabel } from '@/lib/derive';
import type { ModelRemain } from '@/api/types';

function ModelRow({ m }: { m: ModelRemain }) {
  const used = clampPercent(percentOf(m.current_interval_used_percent));
  const status = statusLabel(m.current_interval_status);

  const fillColor = used >= 90 ? 'bg-red' : used >= 70 ? 'bg-ember' : 'bg-mint';
  const remaining = formatRemaining(m.remains_time);

  return (
    <div className="py-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-ink truncate text-xs font-medium">{m.model_name}</span>
        <span className={`shrink-0 font-mono text-[11px] tabular-nums ${status.className}`}>
          {percentOf(m.current_interval_used_percent).toFixed(0)}%
        </span>
      </div>
      <div className="bg-surface2 h-1.5 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${fillColor} transition-[width] duration-300 ease-out`}
          style={{ width: `${used}%` }}
        />
      </div>
      <div className="text-ink3 mt-1 flex items-baseline justify-between text-[10px]">
        <span>每 5h 刷新</span>
        <span className="font-mono tabular-nums">{remaining}</span>
      </div>
    </div>
  );
}

/** Quota section: title + reset window, then one row per model. */
export function QuotaMeter({ models }: { models: ModelRemain[] }) {
  if (!models.length) return null;
  return (
    <section className="mt-4">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-ink3 text-[11px] font-medium tracking-wide uppercase">5h 周期配额</h2>
        <span className="text-ink2 font-mono text-[11px] tabular-nums">{models.length} 项</span>
      </div>
      <div className="divide-line/60 divide-y">
        {models.map((m) => (
          <ModelRow key={m.model_name} m={m} />
        ))}
      </div>
    </section>
  );
}
