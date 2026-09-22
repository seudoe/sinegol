import type { MatchTier } from "@/types/draw";

export const PRIZE_POOL_SHARE: Record<MatchTier, number> = {
  3: 0.25,
  4: 0.35,
  5: 0.4,
};

/**
 * Splits a tier's share of the prize pool equally among that tier's
 * winners. The 5-match jackpot rolls over when there are 0 winners;
 * 3/4-match shares do not roll over (see docs/assumptions.md).
 */
export function calculatePrizePerWinner(
  tier: MatchTier,
  prizePool: number,
  winnerCount: number
): number {
  if (winnerCount === 0) return 0;
  return (prizePool * PRIZE_POOL_SHARE[tier]) / winnerCount;
}
