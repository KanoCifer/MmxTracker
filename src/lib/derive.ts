import { clampPercent, formatRemaining, percentOf } from './format';
import type { RemainResp, UsageSummaryResp } from '@/api/types';
import { pickTone } from './tone';
import type { ModelSignal, WeeklySignal, WidgetSignals } from './types';

// ponytail: hand-rolled alias table — platform model names ("general") are
// stable but not user-facing. Extend when the platform adds a new model.
const MODEL_DISPLAY_NAME: Record<string, string> = {
  general: '文本模型',
  video: '视频模型',
  image: '图像模型',
  audio: '音频模型',
  music: '音乐模型',
};

// ponytail: video quota is hidden by default — the floating widget has
// ~340px of vertical room; the text quota is what users reach for first.
// Add a toggle in ExpandedPanel when/if users complain.
const HIDDEN_BY_DEFAULT = new Set(['video']);

/** Map the API status code to a label + color. 1 = active, 3 = interval over, else muted. */
export function statusLabel(status: number): { text: string; className: string } {
  if (status === 1) return { text: '进行中', className: 'text-ink2' };
  if (status === 3) return { text: '已至边界', className: 'text-amber' };
  return { text: '暂停', className: 'text-amber' };
}

function intervalUsedPct(used: string | number | undefined): number {
  return clampPercent(percentOf(used));
}

/**
 * Worst 5h-window used% across models. `used_percent` is authoritative even
 * when total_count is -1 (count untracked, not truly unlimited).
 */
export function worstIntervalUsedPct(models: RemainResp['model_remains']): number {
  if (!models.length) return 0;
  return Math.max(...models.map((m) => intervalUsedPct(m.current_interval_used_percent)));
}

/**
 * Latest future weekly reset across models that have one. 5h resets are
 * surfaced per-row; the footer tracks the weekly cap because that's the
 * longer-running budget the user plans around.
 */
function nextResetMs(models: RemainResp['model_remains']): number | null {
  const weekly = models.map((m) => m.weekly_end_time).filter((t) => t > 0);
  if (!weekly.length) return null;
  const now = Date.now();
  const future = weekly.filter((t) => t > now);
  if (future.length) return Math.max(...future);
  return now + 7 * 24 * 60 * 60 * 1000;
}

/** Best weekly signal: highest weekly used% across models that actually have a weekly window. */
function weeklySignal(models: RemainResp['model_remains']): WeeklySignal | null {
  let best: WeeklySignal | null = null;
  for (const m of models) {
    // weekly_end_time === 0 ⇒ no weekly window on this model.
    if (!m.weekly_end_time) continue;
    const used = clampPercent(percentOf(m.current_weekly_used_percent));
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

  const modelSignals: ModelSignal[] = models
    .filter((m) => !HIDDEN_BY_DEFAULT.has(m.model_name))
    .map((m) => ({
      name: MODEL_DISPLAY_NAME[m.model_name] ?? m.model_name,
      usedPct: intervalUsedPct(m.current_interval_used_percent),
      statusText: statusLabel(m.current_interval_status).text,
      statusClassName: statusLabel(m.current_interval_status).className,
      remainingText: formatRemaining(m.remains_time),
    }));

  // Worst is across ALL models — hiding video from the panel mustn't hide
  // it from the toolbar badge. A user burning the video quota deserves a
  // badge alarm even if they never open the panel.
  const worstUsedPct = worstIntervalUsedPct(models);

  return {
    consumed: summary?.total_token_consumed ?? '—',
    modelCount: models.length,
    worstUsedPct,
    tone: pickTone(worstUsedPct),
    models: modelSignals,
    secondaryModels: models
      .filter((m) => HIDDEN_BY_DEFAULT.has(m.model_name))
      .map((m) => ({
        name: MODEL_DISPLAY_NAME[m.model_name] ?? m.model_name,
        usedPct: intervalUsedPct(m.current_interval_used_percent),
        statusText: statusLabel(m.current_interval_status).text,
        statusClassName: statusLabel(m.current_interval_status).className,
        remainingText: formatRemaining(m.remains_time),
      })),
    weekly: weeklySignal(models),
    nextResetMs: nextResetMs(models),
  };
}
