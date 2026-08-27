import { onMessage, sendMessage } from './messaging';
import { minimaxApi } from '@/api/minimaxApi';
import type { RemainResp } from '@/api/types';

export function getRemain(): Promise<RemainResp> {
  return sendMessage('getRemain');
}

// Call once from the background worker to register the handler.
export function registerRemainRpc(): void {
  onMessage('getRemain', () => minimaxApi.getRemain());
}
