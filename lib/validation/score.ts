import { z } from "zod";

export const scoreSchema = z.object({
  score: z.number().int().min(1).max(45),
  played_date: z.string().date(),
});

export type ScoreInput = z.infer<typeof scoreSchema>;
