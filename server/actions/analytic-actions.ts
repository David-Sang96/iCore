"use server";

import { db } from "@/server";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { between, eq } from "drizzle-orm";
import { orders, products, users } from "../schema";

export const analytics = async () => {
  try {
    const pendingOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "PENDING"));
    const completeOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "COMPLETE"));
    const cancelOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "CANCEL"));
    const totalUsers = await db.select().from(users);
    const totalProducts = await db.select().from(products);

    return {
      pendingOrders: pendingOrders.length,
      completeOrders: completeOrders.length,
      cancelOrders: cancelOrders.length,
      totalUsers: totalUsers.length,
      totalProducts: totalProducts.length,
    };
  } catch (error) {
    console.log(error);
  }
};

export const weeklyAnalytics = async () => {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(today, i)
    ).reverse();

    return await Promise.all(
      last7Days.map(async (day) => {
        const start = startOfDay(day);
        const end = endOfDay(day);
        const orderData = await db
          .select({ count: orders.id })
          .from(orders)
          .where(between(orders.created, start, end));

        return { day, count: orderData.length };
      })
    );
  } catch (error) {
    console.log(error);
  }
};
