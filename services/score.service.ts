import "server-only";
import type { GolfScore, CreateScoreInput, UpdateScoreInput } from "@/types/score";

export async function listScores(_userId: string): Promise<GolfScore[]> {
  throw new Error("Not implemented");
}

export async function createScore(
  _userId: string,
  _input: CreateScoreInput
): Promise<GolfScore> {
  throw new Error("Not implemented");
}

export async function updateScore(
  _userId: string,
  _scoreId: string,
  _input: UpdateScoreInput
): Promise<GolfScore> {
  throw new Error("Not implemented");
}

export async function deleteScore(
  _userId: string,
  _scoreId: string
): Promise<void> {
  throw new Error("Not implemented");
}
