import "server-only";
import { logger } from "@/lib/logger";
import type {
  CreateDrawInput,
  Draw,
  DrawSimulationResult,
} from "@/types/draw";

export async function createDraw(input: CreateDrawInput): Promise<Draw> {
    try {
        logger.warn("service:draw", "createDraw not implemented", { input });
        throw new Error("Not implemented");
        logger.info("service:draw", "createDraw executed successfully");
    } catch (error) {
        logger.error("service:draw", "Error in createDraw", { error });
        throw error;
    }
}

export async function simulateDraw(drawId: string): Promise<DrawSimulationResult> {
    try {
        logger.warn("service:draw", "simulateDraw not implemented", { drawId });
        throw new Error("Not implemented");
        logger.info("service:draw", "simulateDraw executed successfully");
    } catch (error) {
        logger.error("service:draw", "Error in simulateDraw", { error });
        throw error;
    }
}

export async function publishDraw(drawId: string): Promise<Draw> {
    try {
        logger.warn("service:draw", "publishDraw not implemented", { drawId });
        throw new Error("Not implemented");
        logger.info("service:draw", "publishDraw executed successfully");
    } catch (error) {
        logger.error("service:draw", "Error in publishDraw", { error });
        throw error;
    }
}

export async function getDraw(drawId: string): Promise<Draw> {
    try {
        logger.warn("service:draw", "getDraw not implemented", { drawId });
        throw new Error("Not implemented");
        logger.info("service:draw", "getDraw executed successfully");
    } catch (error) {
        logger.error("service:draw", "Error in getDraw", { error });
        throw error;
    }
}
