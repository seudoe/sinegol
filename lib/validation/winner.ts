import { z } from "zod";

export const winnerReviewSchema = z.object({
  verification_status: z.enum(["approved", "rejected"]),
});

export type WinnerReviewInput = z.infer<typeof winnerReviewSchema>;
