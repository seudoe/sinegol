import { z } from "zod";

export const createDrawSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Expected YYYY-MM"),
  method: z.enum(["random", "algorithmic"]),
});

export type CreateDrawInput = z.infer<typeof createDrawSchema>;
