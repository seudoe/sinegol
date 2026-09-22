import type { MatchTier } from "@/types/draw";

/**
 * Compares a user's numbers against the draw's winning numbers and
 * returns the matched values plus the resulting tier (null if <3 match).
 */
export function matchNumbers(
  userNumbers: number[],
  drawNumbers: number[]
): { matched: number[]; tier: MatchTier | null } {
  const matched = userNumbers.filter((n) => drawNumbers.includes(n));
  const count = matched.length;
  const tier = count >= 3 && count <= 5 ? (count as MatchTier) : null;
  return { matched, tier };
}
