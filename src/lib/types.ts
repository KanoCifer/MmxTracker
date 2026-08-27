/**
 * Shared types for the derivation core. Pulled into their own file so each
 * surface (widget / popup / badge) can import without pulling in a tree.
 */

export type Tone = 'mint' | 'amber' | 'ember' | 'red';

export interface RefreshState {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

/** A single model's 5h-window quota, derived for display. */
export interface ModelSignal {
  name: string;
  usedPct: number; // clamped 0–100; the api reports this even when total_count is -1
  statusText: string;
  statusClassName: string;
  remainingText: string;
}

/** Weekly-boundary summary, derived from the plan's models. */
export interface WeeklySignal {
  usedPct: number;
  remainingText: string;
}

/**
 * One derived picture of the widget — every presentational child drives off
 * this single shape so data derivation stays in one place.
 */
export interface WidgetSignals {
  consumed: string; // total_token_consumed
  modelCount: number;
  worstUsedPct: number; // max 5h used% across models
  tone: Tone; // pickTone(worstUsedPct)
  models: ModelSignal[];
  secondaryModels: ModelSignal[]; // hidden by default; surfaced via "show more"
  weekly: WeeklySignal | null;
  nextResetMs: number | null; // earliest active interval end_time
}
