import { z } from "zod";

export const emailFallbackSchema = z.object({
  email: z.string().min(1, "Enter your email").email("That doesn't look like a valid email"),
});

export type EmailFallbackValues = z.infer<typeof emailFallbackSchema>;

export const leadDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

export type LeadDetailsValues = z.infer<typeof leadDetailsSchema>;
