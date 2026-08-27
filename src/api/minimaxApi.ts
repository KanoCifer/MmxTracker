import { request } from './request';
import type { RemainResp, UsageSummaryResp } from './types';

export const minimaxApi = {
  getUsageSummary: () =>
    request.get<UsageSummaryResp>('/account/token_plan/usage_summary').then((r) => r.data),
  getRemain: () =>
    request.get<RemainResp>('/account/token_plan/remains_percent').then((r) => r.data),
};
