import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useUsage } from '@/lib/useUsage';
import { ExpandedPanel } from './ExpandedPanel';
import { RiskChip } from './RiskChip';
import { deriveWidgetSignals } from '@/lib/derive';

// Persistent vertical offset (px) of the chip from its CSS anchor; X stays hover-driven.
const widgetPosY = storage.defineItem<number>('local:widgetPosY', { fallback: 0 });

export function FloatWidget() {
  const { remain, summary, loading, refresh } = useUsage();
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posY, setPosY] = useState(0);

  // Restore the persisted drag offset before the chip becomes interactive.
  useEffect(() => {
    widgetPosY.getValue().then(setPosY);
  }, []);

  function moveY(y: number) {
    setPosY(y);
    void widgetPosY.setValue(y);
  }

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
    <AnimatePresence mode="popLayout">
      {open ? (
        <ExpandedPanel
          key="panel"
          posY={posY}
          {...signals}
          loading={loading}
          refreshing={refreshing}
          onRefresh={() => void handleRefresh()}
          onCollapse={() => setOpen(false)}
        />
      ) : (
        <RiskChip
          key="chip"
          posY={posY}
          onMoveY={moveY}
          worstUsedPct={signals.worstUsedPct}
          tone={signals.tone}
          onExpand={() => setOpen(true)}
        />
      )}
    </AnimatePresence>
  );
}
