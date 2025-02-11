import * as z from "zod";

export const updateProfileNameSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional(),
});

export const twoFactorSchema = z.object({
  isTwoFactorEnable: z.boolean({ message: "Must be true or false value" }),
  email: z.string().email({ message: "Invalid Email" }),
});
