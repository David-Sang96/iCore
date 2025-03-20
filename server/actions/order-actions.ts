"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import { createOrderSchema } from "@/utils/schema-types/order-schema-type";
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
