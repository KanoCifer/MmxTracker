import { TONE_FILL_CLASS, pickTone } from '@/lib/tone';
import type { WeeklySignal } from '@/lib/types';

export function WeeklyQuotaLine({ weekly }: { weekly: WeeklySignal }) {
  const fillColor = TONE_FILL_CLASS[pickTone(weekly.usedPct)];

  return (
    <div className="border-line/60 mt-1 border-t pt-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-ink3 text-[10px] font-medium tracking-wide uppercase">本周配额</span>
        <span className="text-ink2 font-mono text-[11px] tabular-nums">{weekly.usedPct.toFixed(0)}% · 已用</span>
      </div>
      <div className="bg-surface2 h-1.5 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${fillColor} transition-[width] duration-300 ease-out`}
          style={{ width: `${weekly.usedPct}%` }}
        />
      </div>
    </div>
  );
}
