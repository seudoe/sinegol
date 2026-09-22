import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "At least 8 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.email(),
  password: z.string().min(8, "At least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
