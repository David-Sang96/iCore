"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatCurrency from "@/lib/format-currency";
import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

type OrderDetailsPros = {
  id: number;
  total: number;
};

type OrderDetailsType = {
  id: number;
  userId: string;
  total: number;
  status: string;
  created: Date | null;
  receiptURL: string | null;
  orderProduct: {
    id: number;
    productId: number;
    variantId: number;
    orderId: number;
    quantity: number;
    order: {
      id: number;
      userId: string;
      total: number;
      status: string;
      created: Date | null;
      receiptURL: string | null;
    };
    product: {
      id: number;
      title: string;
      description: string;
      price: number;
      createdAt: Date | null;
    };
    variant: {
      id: number;
      color: string;
      productType: string;
      updated: Date | null;
      productId: number;
      variantImages: {
        id: number;
        image_url: string;
        name: string;
        size: string;
        order: number;
        key: string;
        variantId: number;
      }[];
    };
  }[];
} | null;

const OrderDetails = ({ id, total }: OrderDetailsPros) => {
  const [product, setProduct] = useState<OrderDetailsType | null | undefined>(
    undefined
  );

  useEffect(() => {
    const getData = async () => {
      const response = await db.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
          orderProduct: {
            with: {
              order: true,
              product: true,
              variant: { with: { variantImages: true } },
            },
          },
        },
      });

      if (!response) {
        redirect("/dashboard/orders");
      }
      setProduct(response);
    };

    getData();
  }, [id]);

  if (!product) {
    return <p className="text-center font-medium text-lg">Loading...</p>;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"}>View order</Button>
      </DialogTrigger>
      <DialogContent className="max-sm:w-[95%] mx-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Details of Order #{id}</DialogTitle>
          <DialogDescription>
            Total price - {formatCurrency(total)}
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] ps-4">Image</TableHead>
              <TableHead className="text-center">Product</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Variant</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.orderProduct.map(({ product, variant, quantity }) => (
              <TableRow key={variant.id}>
                <TableCell>
                  <Image
                    alt={product.title}
                    width={55}
                    height={55}
                    src={variant.variantImages[0].image_url}
                  />
                </TableCell>
                <TableCell className="text-center">{product.title}</TableCell>
                <TableCell className="text-center">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="flex justify-center items-center h-16">
                  <div
                    className="size-4 rounded-full "
                    style={{ background: variant.color }}
                  />
                </TableCell>

                <TableCell className="text-center">{quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
