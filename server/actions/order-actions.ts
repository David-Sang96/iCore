"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import { createOrderSchema } from "@/utils/schema-types/order-schema-type";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { orderProduct, orders } from "../schema";

export const createOrderAction = actionClient
  .schema(createOrderSchema)
  .action(async ({ parsedInput: { totalPrice, status, products } }) => {
    console.log(products);
    const session = await auth();
    if (!session)
      return { error: "You are not allowed to perform this action" };

    const order = await db
      .insert(orders)
      .values({
        status,
        total: totalPrice,
        userId: session.user.id,
      })
      .returning();

    products.map(
      async ({ productId, quantity, variantId }) =>
        await db
          .insert(orderProduct)
          .values({ quantity, productId, variantId, orderId: order[0].id })
    );

    return { success: "Order added successfully" };
  });

type ChangeOrderStatusResponse = { success: string } | { error: string };

export const changeOrderStatusAction = async (
  status: string,
  id: number
): Promise<ChangeOrderStatusResponse> => {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/analytics");
    return { success: "Status updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
};
