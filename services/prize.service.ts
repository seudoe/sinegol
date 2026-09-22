import "server-only";
import { logger } from "@/lib/logger";
import type { Winner, WinnerReviewInput } from "@/types/winner";

export async function listWinnersForDraw(drawId: string): Promise<Winner[]> {
    try {
        logger.warn("service:prize", "listWinnersForDraw not implemented", { drawId });
        throw new Error("Not implemented");
        logger.info("service:prize", "listWinnersForDraw executed successfully");
    } catch (error) {
        logger.error("service:prize", "Error in listWinnersForDraw", { error });
        throw error;
    }
}

export async function reviewWinner(
  winnerId: string,
  input: WinnerReviewInput
): Promise<Winner> {
    try {
        logger.warn("service:prize", "reviewWinner not implemented", { winnerId, input });
        throw new Error("Not implemented");
        logger.info("service:prize", "reviewWinner executed successfully");
    } catch (error) {
        logger.error("service:prize", "Error in reviewWinner", { error });
        throw error;
    }
}

export async function markWinnerPaid(winnerId: string): Promise<Winner> {
    try {
        logger.warn("service:prize", "markWinnerPaid not implemented", { winnerId });
        throw new Error("Not implemented");
        logger.info("service:prize", "markWinnerPaid executed successfully");
    } catch (error) {
        logger.error("service:prize", "Error in markWinnerPaid", { error });
        throw error;
    }
}
