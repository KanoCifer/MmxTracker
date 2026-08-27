/** Format a raw integer token count into a compact "8.4M" / "2.83B" label. */
export function formatCompact(n: number): string {
  if (!isFinite(n) || n <= 0) return '0';
  if (n >= 1e9) return `${(n / 1e9).toFixed(2).replace(/\.?0+$/, '')}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.?0+$/, '')}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${Math.round(n)}`;
}

/** Parse a "95%" / "89.71%" string into a number; safe on undefined. */
export function percentOf(str: string | number | undefined): number {
  if (str == null) return 0;
  const v = typeof str === 'number' ? str : parseFloat(String(str));
  return Number.isFinite(v) ? v : 0;
}

/** Clamp a percentage into the 0-100 track range. */
export function clampPercent(n: number): number {
  return Math.max(0, Math.min(100, n));
}

/** Format a millisecond duration into a compact "7 分钟" / "5 小时" / "3天2小时". */
export function formatRemaining(ms: number): string {
  if (!isFinite(ms) || ms <= 0) return '已结束';
  const totalMin = Math.floor(ms / 60000);
  if (totalMin < 60) return `${totalMin} 分钟`;
  const totalHours = Math.floor(totalMin / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  if (days > 0) return `${days}天${hours}小时`;
  const mins = totalMin % 60;
  return mins > 0 ? `${totalHours}小时${mins}分` : `${totalHours} 小时`;
}
