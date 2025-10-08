import { z } from "zod";

export const signUpSchema = z
  .object({
    reg_no: z
      .string()
      .min(13, "Must be exactly 13 characters")
      .max(13, "Must be exactly 13 characters"),
    otp: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
