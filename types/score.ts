export interface GolfScore {
  id: string;
  user_id: string;
  score: number;
  played_date: string;
  created_at: string;
}

export interface CreateScoreInput {
  score: number;
  played_date: string;
}

export interface UpdateScoreInput {
  score?: number;
  played_date?: string;
}
