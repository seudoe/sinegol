import type { MatchTier } from "@/types/draw";

/**
 * Compares a user's numbers against the draw's winning numbers and
 * returns the matched values plus the resulting tier (null if <3 match).
 */
export function matchNumbers(
  _userNumbers: number[],
  _drawNumbers: number[]
): { matched: number[]; tier: MatchTier | null } {
  throw new Error("Not implemented");
}
