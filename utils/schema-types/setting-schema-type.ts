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
