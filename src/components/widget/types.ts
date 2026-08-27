/**
 * Shared types for the floating widget pieces.
 * Pulled into their own file so each subcomponent can import without
 * pulling in the entire FloatWidget tree.
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
  usedPct: number; // clamped 0–100
  unlimited: boolean; // current_interval_total_count === -1
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
  weekly: WeeklySignal | null;
  nextResetMs: number | null; // earliest active interval end_time
}
