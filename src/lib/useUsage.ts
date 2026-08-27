import { useEffect, useState } from 'react';
import { getRemain } from '@/rpc/remain-rpc';
import { getUsageSummary } from '@/rpc/usage-rpc';
import type { RemainResp, UsageSummaryResp } from '@/api/types';

interface UsageState {
  remain: RemainResp | null;
  summary: UsageSummaryResp | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch usage + remain from the background RPC layer. Shared by popup and
 * widget. Returns inert empty values while loading so components render a
 * skeleton rather than a flash of empty state.
 */
export function useUsage(): UsageState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<UsageState>({
    remain: null,
    summary: null,
    loading: true,
    error: null,
  });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [remain, summary] = await Promise.all([getRemain(), getUsageSummary()]);
      setState({ remain, summary, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : '加载失败' }));
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { ...state, refresh: load };
}
