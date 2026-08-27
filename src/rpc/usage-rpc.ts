import { onMessage, sendMessage } from './messaging';
import { minimaxApi } from '@/api/minimaxApi';
import type { UsageSummaryResp } from '@/api/types';

export function getUsageSummary(): Promise<UsageSummaryResp> {
  return sendMessage('getUsageSummary');
}

// Call once from the background worker to register the handler.
export function registerUsageRpc(): void {
  onMessage('getUsageSummary', () => minimaxApi.getUsageSummary());
}
