import { minimaxApi } from '@/api/minimaxApi';
import { worstIntervalUsedPct } from '@/lib/derive';
import { pickTone } from '@/lib/tone';

const ALARM_NAME = 'mmx-badge-refresh';
const ALARM_PERIOD_MIN = 1;

const TONE_COLOR: Record<string, [number, number, number]> = {
  mint: [70, 209, 168], // #46d1a8
  amber: [255, 180, 84], // #ffb454
  ember: [255, 122, 61], // #ff7a3d
  red: [255, 95, 86], // #ff5f56
};

async function applyBadge(usedPct: number): Promise<void> {
  const text = String(Math.min(99, Math.max(0, Math.round(usedPct))));
  const [r, g, b] = TONE_COLOR[pickTone(usedPct)] ?? TONE_COLOR.mint!;
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: [r, g, b, 255] });
  await chrome.action.setBadgeTextColor({ color: '#ffffff' });
}

/** Cached snapshot — keeps the badge stable between successful polls without flashing to "0". */
async function refreshBadge(): Promise<void> {
  try {
    const remain = await minimaxApi.getRemain();
    await applyBadge(worstIntervalUsedPct(remain.model_remains));
  } catch (err) {
    // Surface the failure in the SW console; the badge keeps its last good value.
    console.warn('[mmx-badge] refresh failed, keeping previous badge:', err);
  }
}

export function registerBadgeHandler(): void {
  chrome.alarms.clear(ALARM_NAME).then(() => {
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: ALARM_PERIOD_MIN });
  });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) void refreshBadge();
  });

  void refreshBadge();
}
