import { z } from "zod";

/**
 * Minimal contact capture: just a WhatsApp/phone number.
 * No name, no email, no OTP. The +91 country code is shown in the UI but not
 * stored, so the schema validates a clean 10-digit Indian mobile number.
 */
export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

export type PhoneValues = z.infer<typeof phoneSchema>;

// Kept for backward compatibility with any existing imports/tests.
export const emailFallbackSchema = z.object({
  email: z.string().min(1, "Enter your email").email("That doesn't look like a valid email"),
});

export type EmailFallbackValues = z.infer<typeof emailFallbackSchema>;

export const leadDetailsSchema = phoneSchema;

export type LeadDetailsValues = z.infer<typeof leadDetailsSchema>;
