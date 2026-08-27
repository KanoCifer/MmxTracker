import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useUsage } from '@/lib/useRemain';
import { ExpandedPanel } from './widget/ExpandedPanel';
import { RiskChip } from './widget/RiskChip';
import { deriveWidgetSignals } from './widget/derive';

export function FloatWidget() {
  const { remain, summary, loading, refresh } = useUsage();
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    if (loading || refreshing) return;
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }

  const signals = deriveWidgetSignals(summary, remain);

  return (
    <>
      <AnimatePresence mode="popLayout">
        {open ? (
          <ExpandedPanel
            key="panel"
            {...signals}
            loading={loading}
            refreshing={refreshing}
            onRefresh={() => void handleRefresh()}
            onCollapse={() => setOpen(false)}
          />
        ) : (
          <RiskChip key="chip" worstUsedPct={signals.worstUsedPct} tone={signals.tone} onExpand={() => setOpen(true)} />
        )}
      </AnimatePresence>
    </>
  );
}
