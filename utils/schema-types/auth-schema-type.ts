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

export const passwordResetEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const passwordResetSchema = z
  .object({
    oldPassword: z.string().min(4, {
      message: "Password must be at least 4 characters.",
    }),
    newPassword: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Show error on confirmPassword field
  });
