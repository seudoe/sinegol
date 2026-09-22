import type { GolfScore } from "@/types/score";

/**
 * Derives the 5 draw numbers from all users' submitted scores instead of
 * pure randomness. Exact algorithm defined in docs/assumptions.md.
 */
export function drawAlgorithmicNumbers(_scores: GolfScore[]): number[] {
  throw new Error("Not implemented");
}
