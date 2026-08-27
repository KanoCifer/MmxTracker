import { Flame, RefreshCw, TrendingUp } from 'lucide-react';
import { useUsage } from '@/lib/useRemain';
import { QuotaMeter } from '@/components/QuotaMeter';
import { useState } from 'react';
import type { UsageSummaryResp } from '@/api/types';

/** Tally token counts per model across the daily breakdown. */
function topModel(dateModelUsage: UsageSummaryResp['date_model_usage']): { name: string; tokens: string } | null {
  const totals = new Map<string, number>();
  for (const day of dateModelUsage) {
    for (const m of day.models) {
      totals.set(m.model, (totals.get(m.model) ?? 0) + m.total_token);
    }
  }
  let best: { name: string; tokens: number } | null = null;
  for (const [name, tokens] of totals) {
    if (!best || tokens > best.tokens) best = { name, tokens };
  }
  return best ? { name: best.name, tokens: best.tokens.toLocaleString() } : null;
}

function HeroStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex-1">
      <div className="text-[11px] uppercase tracking-wide text-ink3">{label}</div>
      <div className="font-mono text-2xl font-semibold leading-tight text-ink tabular-nums">{value}</div>
      <div className="text-[11px] text-ink2">{sub}</div>
    </div>
  );
}

/** Inline sparkline of the last 14 days of token consumption. */
function Sparkline({ values }: { values: number[] }) {
  const data = values.slice(-14);
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-10 items-end gap-[2px]">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${v > 0 ? 'bg-ember/70' : 'bg-surface2'}`}
          style={{ height: `${v > 0 ? Math.max((v / max) * 100, 6) : 3}%` }}
        />
      ))}
    </div>
  );
}

function App() {
  const { remain, summary, loading, error, refresh } = useUsage();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  // total_token_consumed is already a formatted string like "2.83B" — render it
  // directly, never Number() it (that yields NaN → "0").
  const consumed = summary?.total_token_consumed ?? '—';
  const main = summary ? topModel(summary.date_model_usage) : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col px-4 py-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-ember" aria-hidden />
          <span className="text-sm font-semibold tracking-tight text-ink">MmxTracker</span>
        </div>
        <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-ink2">
          {summary?.last_update_time ?? '同步中'}
        </span>
      </header>

      {/* Hero: cumulative consumption */}
      <section className="mt-5 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink3">
          <TrendingUp className="h-3.5 w-3.5 text-ink3" aria-hidden />
          累计消耗
        </div>
        <div className="mt-1 font-mono text-4xl font-bold tracking-tight text-ink tabular-nums">{consumed}</div>
        <div className="mt-1 text-xs text-ink2">
          {main ? `${main.name} 为主力模型 (${main.tokens})` : `活跃 ${summary?.active_days ?? 0} 天`}
        </div>
      </section>

      {/* Sparkline: last 14 days */}
      {summary && summary.daily_token_usage.length > 0 && (
        <section className="mt-4">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink3">近 14 天消耗</div>
          <Sparkline values={summary.daily_token_usage} />
        </section>
      )}

      {/* Quota bars */}
      {remain?.model_remains && <QuotaMeter models={remain.model_remains} />}

      {/* Footer stats */}
      {summary && (
        <section className="mt-4 grid grid-cols-2 gap-3">
          <HeroStat label="活跃天数" value={String(summary.active_days)} sub={`连续 ${summary.current_consecutive_days} 天`} />
          <HeroStat label="使用排行" value={`${summary.usage_ranking_percent.toFixed(1)}%`} sub="领先用户" />
        </section>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-1.5 rounded-full bg-ember px-3 py-1.5 text-xs font-medium text-white transition-[scale,opacity] duration-150 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
          {refreshing ? '刷新中' : '刷新'}
        </button>
        {error && <span className="text-xs text-red">{error}</span>}
      </div>
    </div>
  );
}

export default App;
