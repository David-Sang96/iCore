import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { adminColumns } from "@/components/order/admin-column";
import { userColumns } from "@/components/order/user-column";
import { DataTable } from "./data-table";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/");
  const isAdmin = session.user.role === "admin";

  let orderProducts;

  orderProducts = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    orderBy: (orders, { desc }) => [desc(orders.id)],
  });

  if (isAdmin) {
    orderProducts = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.id)],
    });
  }

  const orderData = orderProducts.map((item) => ({
    id: item.id,
    total: item.total,
    status: item.status,
    created: new Date(item.created!),
    receiptURL: item.receiptURL || "",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isAdmin ? "All orders" : "Your orders"}</CardTitle>
        <CardDescription>
          {isAdmin
            ? "View all the orders and status"
            : "View all your orders and statuses"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAdmin ? (
          <DataTable columns={adminColumns} data={orderData} />
        ) : (
          <DataTable columns={userColumns} data={orderData} />
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
