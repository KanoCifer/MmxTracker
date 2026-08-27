import { TONE_FILL_CLASS, pickTone } from './tone';
import type { WeeklySignal } from './types';

/**
 * A single compact row for the weekly-boundary summary. Developers care
 * about the weekly cap as much as the 5h window, so it earns a line — but
 * it stays one line, not a parallel list.
 */
export function WeeklyQuotaLine({ weekly }: { weekly: WeeklySignal }) {
  const fillColor = TONE_FILL_CLASS[pickTone(weekly.usedPct)];

  return (
    <div className="border-line/60 mt-1 border-t pt-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-medium tracking-wide text-ink3 uppercase">本周配额</span>
        <span className="font-mono text-[11px] tabular-nums text-ink2">
          {weekly.usedPct.toFixed(0)}% · 剩余 {weekly.remainingText}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
        <div
          className={`h-full rounded-full ${fillColor} transition-[width] duration-300 ease-out`}
          style={{ width: `${weekly.usedPct}%` }}
        />
      </div>
    </div>
  );
}
