import { z } from "zod";

export const charitySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(1).max(2000),
  image_url: z.url().nullable().optional(),
  featured: z.boolean().default(false),
});

export const userCharitySelectionSchema = z.object({
  charity_id: z.uuid(),
  contribution_percentage: z.number().min(1).max(100),
});

export type CharityInput = z.infer<typeof charitySchema>;
export type UserCharitySelectionInput = z.infer<
  typeof userCharitySelectionSchema
>;
