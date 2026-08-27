import { defineExtensionMessaging } from '@webext-core/messaging';
import type { RemainResp, UsageSummaryResp } from '@/api/types';

// Client contexts (popup / options / content script) send these to the background,
// which holds the host permission + session cookie and proxies minimaxApi.
export interface RpcProtocolMap {
  getUsageSummary(): UsageSummaryResp;
  getRemain(): RemainResp;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<RpcProtocolMap>();
