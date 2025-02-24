import { z } from "zod";

export const variantSchema = z.object({
  id: z.number(),
  productId: z.number(),
  editMode: z.boolean(),
  color: z.string().min(3, { message: "Please enter at least 3 characters" }),
  tags: z.array(
    z.string().min(3, { message: "Please enter at least 3 characters" })
  ),
  productType: z
    .string()
    .min(3, { message: "Please enter at least 3 characters" }),
  variantImages: z.array(
    z.object({
      id: z.number().optional(),
      url: z.string().url({ message: "Please enter a valid image url." }),
      name: z.string(),
      size: z.number(),
      key: z.string().optional(),
    })
  ),
});
