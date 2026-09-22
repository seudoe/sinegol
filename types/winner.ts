import type { MatchTier } from "./draw";

export type VerificationStatus = "pending" | "approved" | "rejected";

export type PayoutStatus = "pending" | "paid";

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_tier: MatchTier;
  prize_amount: number;
  proof_url: string | null;
  verification_status: VerificationStatus;
  payout_status: PayoutStatus;
}

export interface WinnerReviewInput {
  verification_status: VerificationStatus;
}
