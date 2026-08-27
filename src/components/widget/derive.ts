import { clampPercent, formatRemaining, percentOf } from '@/lib/format';
import type { RemainResp, UsageSummaryResp } from '@/api/types';
import { pickTone } from './tone';
import type { ModelSignal, WeeklySignal, WidgetSignals } from './types';

/** Map the API status code to a label + color. 1 = active, 3 = interval over, else muted. */
function statusLabel(status: number): { text: string; className: string } {
  if (status === 1) return { text: '进行中', className: 'text-ink2' };
  if (status === 3) return { text: '已至边界', className: 'text-amber' };
  return { text: '暂停', className: 'text-amber' };
}

/** The earliest future 5h reset across models; falls back to the latest end_time. */
function nextResetMs(models: RemainResp['model_remains']): number | null {
  if (!models.length) return null;
  const now = Date.now();
  const endTimes = models
    .map((m) => m.end_time)
    .filter((t) => t > 0)
    .sort((a, b) => a - b);
  if (!endTimes.length) return null;
  const future = endTimes.find((t) => t * 1000 > now);
  const target = future ?? endTimes.at(-1);
  return target ? target * 1000 : null;
}

/** Best weekly signal across models: the highest weekly used% + that model's remaining. */
function weeklySignal(models: RemainResp['model_remains']): WeeklySignal | null {
  if (!models.length) return null;
  let best: WeeklySignal | null = null;
  for (const m of models) {
    const used = clampPercent(percentOf(m.current_weekly_used_percent));
    // Unlimited plans (total_count -1) have no meaningful weekly percentage.
    if (m.current_weekly_total_count === -1) continue;
    if (!best || used > best.usedPct) {
      best = { usedPct: used, remainingText: formatRemaining(m.weekly_remains_time) };
    }
  }
  return best;
}

/**
 * Turn raw API responses into one display-ready picture of the widget.
 * Pure and UI-agnostic so FloatWidget only picks state and children only
 * render. No time-dependent logic lives here except the reset timestamp,
 * which the countdown hook turns into a ticking label.
 */
export function deriveWidgetSignals(summary: UsageSummaryResp | null, remain: RemainResp | null): WidgetSignals {
  const models = remain?.model_remains ?? [];

  const modelSignals: ModelSignal[] = models.map((m) => ({
    name: m.model_name,
    usedPct: clampPercent(percentOf(m.current_interval_used_percent)),
    unlimited: m.current_interval_total_count === -1,
    statusText: statusLabel(m.current_interval_status).text,
    statusClassName: statusLabel(m.current_interval_status).className,
    remainingText: formatRemaining(m.remains_time),
  }));

  const worstUsedPct = modelSignals.length
    ? Math.max(...modelSignals.map((m) => m.usedPct))
    : 0;

  return {
    consumed: summary?.total_token_consumed ?? '—',
    modelCount: models.length,
    worstUsedPct,
    tone: pickTone(worstUsedPct),
    models: modelSignals,
    weekly: weeklySignal(models),
    nextResetMs: nextResetMs(models),
  };
}
