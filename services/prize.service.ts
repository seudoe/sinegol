import "server-only";
import type { Winner, WinnerReviewInput } from "@/types/winner";

export async function listWinnersForDraw(_drawId: string): Promise<Winner[]> {
  throw new Error("Not implemented");
}

export async function reviewWinner(
  _winnerId: string,
  _input: WinnerReviewInput
): Promise<Winner> {
  throw new Error("Not implemented");
}

export async function markWinnerPaid(_winnerId: string): Promise<Winner> {
  throw new Error("Not implemented");
}
