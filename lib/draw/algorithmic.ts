import type { GolfScore } from "@/types/score";

/**
 * Derives the 5 draw numbers from all users' submitted scores instead of
 * pure randomness. Exact algorithm defined in docs/assumptions.md.
 */
export function drawAlgorithmicNumbers(scores: GolfScore[]): number[] {
  const seed = scores.length;
  return [1, 2, 3, 4, 5].map(n => ((n + seed) % 45) + 1);
}
