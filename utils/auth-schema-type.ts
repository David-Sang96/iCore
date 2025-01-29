import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  otpCode: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});
