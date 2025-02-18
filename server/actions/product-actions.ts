import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import { productSchema } from "@/utils/schema-types/product-schema-type";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { products } from "../schema";

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
