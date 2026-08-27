import { useState } from 'react';
import { ChevronDown, Flame, RefreshCw, X } from 'lucide-react';
import { useUsage } from '@/lib/useRemain';
import { QuotaMeter } from '@/components/QuotaMeter';
import { motion } from 'motion/react';

/**
 * Floating token-burn widget for the content script.
 * Collapsed: a compact pill showing burn at a glance (click to expand).
 * Expanded: the full consumption hero + per-model quota.
 * Anchored in a shadow root, so it carries its own tokens via :host.
 */
export function FloatWidget() {
  const { remain, summary, loading, error, refresh } = useUsage();
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  // total_token_consumed is already a formatted string ("2.83B") — render it
  // directly. Number() on it yields NaN.
  const consumed = summary?.total_token_consumed ?? '—';

  if (!open) {
    return (
      <motion.button
        drag
        dragMomentum={false}
        type="button"
        onClick={() => setOpen(true)}
        className="border-line bg-surface/90 text-ink fixed right-4 bottom-4 z-(--z-float) flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs shadow-lg backdrop-blur transition-[scale] duration-100 active:scale-95"
      >
        <Flame className="text-ember h-3.5 w-3.5" aria-hidden />
        <span className="font-mono tabular-nums">{consumed}</span>
        <ChevronDown className="text-ink2 h-3 w-3" aria-hidden />
      </motion.button>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      // Cap height to viewport so on short windows the panel scrolls internally
      // instead of being clipped off-screen at the top. w-72 + p-4 + 2*headroom
      // leaves room for the user to drag it without losing the close button.
      className="border-line bg-surface fixed right-4 bottom-4 z-(--z-float) flex w-72 max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl border p-4 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="text-ink flex items-center gap-1.5 text-xs font-medium">
          <Flame className="text-ember h-3.5 w-3.5" aria-hidden />
          令牌消耗
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-label="刷新"
            className="text-ink2 rounded p-1 transition-[scale] duration-100 active:scale-90 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="收起"
            className="text-ink2 rounded p-1 transition-[scale] duration-100 active:scale-90"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="text-ink mt-2 font-mono text-3xl font-bold tracking-tight tabular-nums">{consumed}</div>
      <div className="text-ink2 mt-0.5 text-[11px]">
        {summary ? `活跃 ${summary.active_days} 天 · ${summary.last_update_time}` : '同步中'}
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        {summary && summary.daily_token_usage.length > 0 && (
          <div className="flex h-8 items-end gap-[2px]">
            {summary.daily_token_usage.slice(-14).map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${v > 0 ? 'bg-ember/70' : 'bg-surface2'}`}
                style={{
                  height: `${v > 0 ? Math.max((v / Math.max(...summary.daily_token_usage.slice(-14), 1)) * 100, 6) : 3}%`,
                }}
              />
            ))}
          </div>
        )}

        {remain?.model_remains && <QuotaMeter models={remain.model_remains} />}
        {error && <div className="text-red mt-2 text-[11px]">{error}</div>}
      </div>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-ink2 hover:text-ink mt-3 flex items-center gap-1 text-[11px] transition-colors"
      >
        <ChevronDown className="h-3 w-3 rotate-180" aria-hidden />
        收起
      </button>
    </motion.div>
  );
}
