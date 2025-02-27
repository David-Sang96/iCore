import { z } from "zod";

export const variantSchema = z.object({
  id: z.number().optional(),
  productId: z.number(),
  editMode: z.boolean(),
  color: z.string().min(3, { message: "Please enter at least 3 characters" }),
  tags: z
    .array(z.string().min(3, { message: "Please enter at least 3 characters" }))
    .min(1, { message: "Please add at least one tag." }), // <-- Enforce at least one tag for validation message
  productType: z
    .string()
    .min(3, { message: "Please enter at least 3 characters" }),
  images: z
    .array(
      z.object({
        id: z.number().optional(),
        url: z.string().url({ message: "Please enter a valid image URL." }),
        name: z.string(),
        size: z.number(),
        key: z.string(),
      })
    )
    .min(1, { message: "Please upload at least one image." }), // <-- Enforce at least one image for validation message
});

export const deleteVariantSchema = z.object({
  id: z.number(),
  key: z.array(z.object({ key: z.string() })),
});
