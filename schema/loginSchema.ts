import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().regex(/^[\w.-]+@nitjsr\.ac\.in$/, {
        message: "Invalid email. Must end with @nitjsr.ac.in",
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
});