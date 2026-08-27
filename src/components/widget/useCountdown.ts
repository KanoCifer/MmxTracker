import { useEffect, useState } from 'react';

/**
 * Ticking countdown to a future Unix timestamp, formatted for display.
 * `null` target renders as an empty string so consumers can hide it.
 *
 * The target is a Unix timestamp in *seconds* (as the platform API returns)
 * or milliseconds — we normalize either. Re-renders once per second.
 */
export function useCountdown(unixTarget: number | null | undefined) {
  const [now, setNow] = useState(() => Date.now());
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (unixTarget == null) {
      setLabel('');
      return;
    }
    const targetMs = unixTarget < 1e12 ? unixTarget * 1000 : unixTarget;

    function tick() {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setLabel('即将重置');
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const sec = totalSec % 60;
      const totalMin = Math.floor(totalSec / 60);
      const min = totalMin % 60;
      const hours = Math.floor(totalMin / 60);
      setLabel(hours > 0 ? `${hours}小时${min}分` : totalMin > 0 ? `${totalMin}分${sec}秒` : `${sec}秒`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [unixTarget]);

  return label;
}
