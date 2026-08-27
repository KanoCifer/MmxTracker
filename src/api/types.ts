export interface BaseResp {
  status_code: number;
  status_msg: string;
}

// ---- /account/token_plan/remains_percent ----
export interface ModelRemain {
  model_name: string;
  start_time: number;
  end_time: number;
  remains_time: number;
  // Counts use -1 to mean "count untracked" — still get a real used_percent.
  current_interval_total_count: number;
  current_interval_used_count: number;
  current_interval_remains_count: number;
  current_interval_used_percent: string; // "95%"
  current_interval_total_percent: string; // "100%"
  current_interval_status: number; // 1, 3, ...
  weekly_start_time: number;
  weekly_end_time: number;
  weekly_remains_time: number;
  current_weekly_total_count: number;
  current_weekly_used_count: number;
  current_weekly_remains_count: number;
  current_weekly_used_percent: string; // "69%"
  current_weekly_total_percent: string; // "100%"
  current_weekly_status: number;
}

export interface RemainResp {
  model_remains: ModelRemain[];
  base_resp: BaseResp;
}

// ---- /account/token_plan/usage_summary ----
export interface DailyModelUsage {
  model: string;
  input_token: number;
  cache_read_token: number;
  cache_create_token: number;
  output_token: number;
  total_token: number;
  cache_hit_percent: string; // "89.71%"
}

export interface DateModelUsage {
  date: string; // "2026-04-03"
  models: DailyModelUsage[];
  total_input_token: number;
  total_cache_read_token: number;
  total_cache_create_token: number;
  total_output_token: number;
  total_token: number;
  cache_hit_percent: string; // "0%"
}

export interface MostActiveDay {
  date: string;
  token_count: string; // "223.20M"
  image_count: string;
  video_count: string;
  music_count: string;
  voice_character_count: string;
}

export interface UsageSummaryResp {
  total_days: number;
  total_token_consumed: string; // "2.83B"
  usage_ranking_percent: number; // 3.7740446063394684
  most_active_day: MostActiveDay;
  active_days: number;
  current_consecutive_days: number;
  daily_token_usage: number[]; // 147 entries
  date_model_usage: DateModelUsage[];
  last_update_time: string; // "08-27 18:00"
  base_resp: BaseResp;
}
