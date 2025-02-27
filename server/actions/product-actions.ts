"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import {
  deleteProductSchem,
  productSchema,
} from "@/utils/schema-types/product-schema-type";
import {
  deleteVariantSchema,
  variantSchema,
} from "@/utils/schema-types/variant-schema-type";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { UTApi } from "uploadthing/server";
import { products, variantImages, variants, variantTags } from "../schema";

export const createOrUpdateProductAction = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput: { title, description, price, id } }) => {
    // prettier-ignore
    const cleanDescription = sanitizeHtml(description, {
        allowedTags: [ "h1", "h2", "h3",  "b", "strong", "i", "em", "s", "del","ol", "ul", "li"],
        allowedAttributes: {},
      });

    try {
      if (id) {
        const existingProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!existingProduct) return { error: "Product not found" };
        await db
          .update(products)
          .set({ title, description: cleanDescription, price })
          .where(eq(products.id, existingProduct.id));
        revalidatePath("/dashboard/products");
        return { success: "Updated successfully" };
      } else {
        const product = await db
          .insert(products)
          .values({
            title,
            description: cleanDescription,
            price,
          })
          .returning();
        revalidatePath("/dashboard/products");
        return { success: "Created successfully", product: product[0] };
      }
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  });

export const getOneProductAction = async (id: number) => {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!product) return { error: "Product not found" };
    return { success: product };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const deleteProductAction = actionClient
  .schema(deleteProductSchem)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (!product) return { error: "Product not found" };
      await db.delete(products).where(eq(products.id, product.id));

      revalidatePath("/dashboard/products");
      return { success: "Deleted successfully" };
    } catch (error) {
      return { error: "Something went wrong" };
    }
  });

export const removeImageOnUploadThing = async (imageKey: string) => {
  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(imageKey);
    return { success: "Image remove successfully" };
  } catch (error) {
    return { error: "Image removes failed on server" };
  }
};

export const createOrUpdateVariantAction = actionClient
  .schema(variantSchema)
  .action(
    async ({
      // prettier-ignore
      parsedInput: { color, productId, productType,images, tags, id ,editMode},
    }) => {
      try {
        if (editMode && id) {
          const updatedVariant = await db
            .update(variants)
            .set({ color, productId, productType })
            .where(eq(variants.id, id))
            .returning();
          if (!updatedVariant.length)
            return { error: "Failed to update variant" };
          const variantId = updatedVariant[0].id;

          const product = await db.query.products.findFirst({
            where: eq(products.id, updatedVariant[0].productId),
          });
          if (!product) return { error: "Product not found" };

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, variantId)); // delete all images

          await db.insert(variantImages).values(
            images.map((img, idx) => ({
              image_url: img.url,
              name: img.name,
              size: img.size.toString(),
              key: img.key!,
              variantId,
              order: idx,
            }))
          );

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, variantId));

          await db
            .insert(variantTags)
            .values(tags.map((tag) => ({ tag, variantId })));

          revalidatePath("/dashboard/products");
          return { success: `${product.title} variant updated successfully` };
        }

        if (!editMode) {
          const variant = await db
            .insert(variants)
            .values({ color, productType, productId })
            .returning();
          if (!variant.length) return { error: "Failed to create variant" };
          const variantId = variant[0].id;

          const product = await db.query.products.findFirst({
            where: eq(products.id, variant[0].productId),
          });
          if (!product) return { error: "Product not found" };

          await db
            .insert(variantTags)
            .values(tags.map((tag) => ({ tag, variantId })));

          await db.insert(variantImages).values(
            images.map((img, idx) => ({
              image_url: img.url,
              name: img.name,
              size: img.size.toString(),
              key: img.key,
              variantId,
              order: idx,
            }))
          );

          revalidatePath("/dashboard/products");
          return { success: `${product.title} variant created successfully` };
        }
        return;
      } catch (error) {
        console.log(error);
        return { error: "Something went wrong" };
      }
    }
  );

export const deleteVaraintAction = actionClient
  .schema(deleteVariantSchema)
  .action(async ({ parsedInput: { id, key: imageKeys } }) => {
    try {
      const variant = await db.query.variants.findFirst({
        where: eq(variants.id, id),
      });
      if (!variant) return { error: "No variant found" };

      // Delete images concurrently if `key` has image keys
      if (imageKeys.length) {
        await Promise.all(
          imageKeys.map(({ key }) => removeImageOnUploadThing(key))
        );
      }

      await db.delete(variants).where(eq(variants.id, variant.id));
      revalidatePath("/dashboard/products");
      return { success: "Deleted successfully" };
    } catch (error) {
      return { error: "Something went wrong" };
    }
  });
