import "server-only";
import { logger } from "@/lib/logger";
import type { GolfScore, CreateScoreInput, UpdateScoreInput } from "@/types/score";

export async function listScores(userId: string): Promise<GolfScore[]> {
    try {
        logger.warn("service:score", "listScores not implemented", { userId });
        throw new Error("Not implemented");
        logger.info("service:score", "listScores executed successfully");
    } catch (error) {
        logger.error("service:score", "Error in listScores", { error });
        throw error;
    }
}

export async function createScore(
  userId: string,
  input: CreateScoreInput
): Promise<GolfScore> {
    try {
        logger.warn("service:score", "createScore not implemented", { userId, input });
        throw new Error("Not implemented");
        logger.info("service:score", "createScore executed successfully");
    } catch (error) {
        logger.error("service:score", "Error in createScore", { error });
        throw error;
    }
}

export async function updateScore(
  userId: string,
  scoreId: string,
  input: UpdateScoreInput
): Promise<GolfScore> {
    try {
        logger.warn("service:score", "updateScore not implemented", { userId, scoreId, input });
        throw new Error("Not implemented");
        logger.info("service:score", "updateScore executed successfully");
    } catch (error) {
        logger.error("service:score", "Error in updateScore", { error });
        throw error;
    }
}

export async function deleteScore(
  userId: string,
  scoreId: string
): Promise<void> {
    try {
        logger.warn("service:score", "deleteScore not implemented", { userId, scoreId });
        throw new Error("Not implemented");
        logger.info("service:score", "deleteScore executed successfully");
    } catch (error) {
        logger.error("service:score", "Error in deleteScore", { error });
        throw error;
    }
}
