import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { MascotBadge } from './MascotBadge';
import { ModelUsageRow } from './ModelUsageRow';
import { WeeklyQuotaLine } from './WeeklyQuotaLine';
import { TONE_DOT_CLASS } from './tone';
import { useCountdown } from './useCountdown';
import type { RefreshState, WidgetSignals } from './types';

interface Props extends WidgetSignals, RefreshState {
  onCollapse: () => void;
}

export function ExpandedPanel({
  consumed,
  worstUsedPct,
  tone,
  modelCount,
  models,
  weekly,
  nextResetMs,
  loading,
  refreshing,
  onRefresh,
  onCollapse,
}: Props) {
  const countdown = useCountdown(nextResetMs);
  const refreshDisabled = loading || refreshing;

  return (
    <motion.div layoutId="float-widget" className="fixed right-4 bottom-4">
      <MascotBadge tone={tone} refreshing={refreshing} onCollapse={onCollapse} />

      <div className="border-line bg-surface text-ink relative flex max-h-[340px] w-[300px] flex-col overflow-hidden rounded-3xl border px-4 pt-7 pb-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)]">
        {/* Header: cumulative consumption + model count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-ink3 text-[10px] font-medium tracking-wider uppercase">累计消耗</span>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshDisabled}
            aria-label="刷新"
            className="text-ink2 hover:text-ink rounded p-0.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <motion.div
            key={consumed}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className={`font-mono text-[28px] leading-none font-bold tracking-tight tabular-nums ${
              tone === 'red' ? 'text-red' : tone === 'ember' ? 'text-ember' : 'text-ink'
            }`}
          >
            {consumed}
          </motion.div>
          <span className="text-ink3 text-[11px] tabular-nums">
            {worstUsedPct.toFixed(0)}%{' '}
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_DOT_CLASS[tone]}`} />
          </span>
        </div>

        {/* 5h window, one row per model */}
        {models.length > 0 && (
          <div className="border-line/60 divide-line/60 mt-3 max-h-[168px] divide-y overflow-y-auto pr-1">
            {models.map((m) => (
              <ModelUsageRow key={m.name} m={m} />
            ))}
          </div>
        )}

        {/* Weekly boundary */}
        {weekly && <WeeklyQuotaLine weekly={weekly} />}

        {/* Footer: next-reset countdown */}
        {nextResetMs != null && (
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-ink3 text-[10px] tracking-wide uppercase">下次重置</span>
            <span className="text-ink2 font-mono text-[11px] tabular-nums">{countdown}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
