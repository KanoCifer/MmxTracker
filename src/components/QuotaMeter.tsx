import { clampPercent, formatRemaining, percentOf } from '@/lib/format';
import type { ModelRemain } from '@/api/types';

/** Map the API status code to a label + color. 1 = active, 3 = interval over, else muted. */
function statusLabel(status: number): { text: string; className: string } {
  if (status === 1) return { text: '进行中', className: 'text-ink2' };
  if (status === 3) return { text: '已至边界', className: 'text-amber' };
  return { text: '暂停', className: 'text-amber' };
}

/** A single model's quota bar. Uses the 5h interval window (current_interval_*). */
function ModelRow({ m }: { m: ModelRemain }) {
  const used = clampPercent(percentOf(m.current_interval_used_percent));
  const status = statusLabel(m.current_interval_status);
  // Low fill (much remaining) reads safer in mint; near the cap it tips to ember/red.
  const fillColor = used >= 90 ? 'bg-red' : used >= 70 ? 'bg-ember' : 'bg-mint';
  const remaining = formatRemaining(m.remains_time);

  return (
    <div className="py-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-medium text-ink">{m.model_name}</span>
        <span className={`shrink-0 font-mono text-[11px] tabular-nums ${status.className}`}>
          {percentOf(m.current_interval_used_percent).toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
        <div
          className={`h-full rounded-full ${fillColor} transition-[width] duration-300 ease-out`}
          style={{ width: `${used}%` }}
        />
      </div>
      <div className="mt-1 flex items-baseline justify-between text-[10px] text-ink3">
        <span>{status.text} · 每 5h 刷新</span>
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
        <h2 className="text-[11px] font-medium uppercase tracking-wide text-ink3">5h 周期配额</h2>
        <span className="font-mono text-[11px] tabular-nums text-ink2">{models.length} 项</span>
      </div>
      <div className="divide-y divide-line/60">
        {models.map((m) => (
          <ModelRow key={m.model_name} m={m} />
        ))}
      </div>
    </section>
  );
}
