export type DrawMethod = "random" | "algorithmic";

export type DrawStatus = "draft" | "published";

export interface Draw {
  id: string;
  month: string;
  method: DrawMethod;
  numbers: number[];
  status: DrawStatus;
  created_at: string;
  published_at: string | null;
}

export interface CreateDrawInput {
  month: string;
  method: DrawMethod;
}

export interface DrawSimulationResult {
  draw: Pick<Draw, "month" | "method" | "numbers">;
  matches: DrawMatchResult[];
}

export interface DrawMatchResult {
  user_id: string;
  matched_numbers: number[];
  match_tier: MatchTier | null;
}

export type MatchTier = 3 | 4 | 5;
