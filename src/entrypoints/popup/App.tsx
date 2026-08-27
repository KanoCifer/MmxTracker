import { Flame, RefreshCw, TrendingUp, ExternalLink } from 'lucide-react';
import { useUsage } from '@/lib/useUsage';
import { QuotaMeter } from './QuotaMeter';
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
      <div className="text-ink3 text-[11px] tracking-wide uppercase">{label}</div>
      <div className="text-ink font-mono text-2xl leading-tight font-semibold tabular-nums">{value}</div>
      <div className="text-ink2 text-[11px]">{sub}</div>
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
          <Flame className="text-ember h-4 w-4" aria-hidden />
          <span className="text-ink text-sm font-semibold tracking-tight">MmxTracker</span>
        </div>
        <span className="border-line bg-surface text-ink2 rounded-full border px-2 py-0.5 text-[10px]">
          {summary?.last_update_time ?? '同步中'}
        </span>
      </header>

      {/* Hero: cumulative consumption */}
      <section className="border-line bg-surface mt-5 rounded-2xl border p-4">
        <div className="text-ink3 flex items-center gap-2 text-[11px] tracking-wide uppercase">
          <TrendingUp className="text-ink3 h-3.5 w-3.5" aria-hidden />
          累计消耗
        </div>
        <div className="text-ink mt-1 font-mono text-4xl font-bold tracking-tight tabular-nums">{consumed}</div>
        <div className="text-ink2 mt-1 text-xs">
          {main ? `${main.name} 为主力模型 (${main.tokens})` : `活跃 ${summary?.active_days ?? 0} 天`}
        </div>
      </section>

      {/* Sparkline: last 14 days */}
      {summary && summary.daily_token_usage.length > 0 && (
        <section className="mt-4">
          <div className="text-ink3 mb-2 text-[11px] font-medium tracking-wide uppercase">近 14 天消耗</div>
          <Sparkline values={summary.daily_token_usage} />
        </section>
      )}

      {/* Quota bars */}
      {remain?.model_remains && <QuotaMeter models={remain.model_remains} />}

      {/* Footer stats */}
      {summary && (
        <section className="mt-4 grid grid-cols-2 gap-3">
          <HeroStat
            label="活跃天数"
            value={String(summary.active_days)}
            sub={`连续 ${summary.current_consecutive_days} 天`}
          />
          <HeroStat label="使用排行" value={`${summary.usage_ranking_percent.toFixed(1)}%`} sub="Top" />
        </section>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="bg-ember inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-[scale,opacity] duration-150 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
          {refreshing ? '刷新中' : '刷新'}
        </button>
        <a
          href="https://platform.minimaxi.com/console/usage"
          target="_blank"
          rel="noreferrer"
          className="text-ink2 hover:text-ink inline-flex items-center gap-1 text-xs transition-colors"
        >
          开放平台
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
        {error && <span className="text-red text-xs">{error}</span>}
      </div>
    </div>
  );
}

export default App;
