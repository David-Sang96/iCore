import * as z from "zod";

export const productSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description is too long"),
  price: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Price must be a positive number"),
  isChecked: z.boolean().default(false).optional(),
});
