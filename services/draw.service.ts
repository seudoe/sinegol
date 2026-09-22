import "server-only";
import type {
  CreateDrawInput,
  Draw,
  DrawSimulationResult,
} from "@/types/draw";

export async function createDraw(_input: CreateDrawInput): Promise<Draw> {
  throw new Error("Not implemented");
}

export async function simulateDraw(
  _drawId: string
): Promise<DrawSimulationResult> {
  throw new Error("Not implemented");
}

export async function publishDraw(_drawId: string): Promise<Draw> {
  throw new Error("Not implemented");
}

export async function getDraw(_drawId: string): Promise<Draw> {
  throw new Error("Not implemented");
}
