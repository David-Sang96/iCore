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
import { columns } from "./columns";
import { DataTable } from "./data-table";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/");

  const ordersData = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          variant: { with: { variantImages: true } },
          order: true,
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.id)],
  });

  const orderData = ordersData.map((item) => ({
    id: item.id,
    total: item.total,
    status: item.status,
    created: new Date(item.created!),
    receiptURL: item.receiptURL || "",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your orders</CardTitle>
        <CardDescription>View all your orders and status</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={orderData} />
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
