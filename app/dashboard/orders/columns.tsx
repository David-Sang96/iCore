"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import OrderDetails from "./order-details";

export type Payment = {
  id: number;
  total: number;
  status: string;
  created: Date;
  receiptURL: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant={"ghost"}
        >
          Total
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className=" font-medium text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "created", // Must match the field in your data
    header: ({ column }) => (
      <div className="text-center">
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant={"ghost"}
        >
          Date
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("created") as Date; // Must be the same as accessorKey
      const date = new Date(rawDate);
      return (
        <div className="text-center font-medium">
          {format(date, "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const orderStatus = row.getValue("status") as string;
      return (
        <div
          className={cn(
            " font-medium mx-auto text-xs w-fit text-white px-2 py-1 rounded",
            orderStatus === "PENDING"
              ? "bg-blue-500 "
              : orderStatus === "COMPLETE"
                ? "bg-green-500"
                : "bg-red-500 "
          )}
        >
          {orderStatus}
        </div>
      );
    },
  },

  {
    accessorKey: "action",
    header: () => <div className="text-end pe-5">Actions</div>,
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      const total = row.getValue("total") as number;

      return (
        <div className="text-end">
          <OrderDetails id={id} total={total} />
        </div>
      );
    },
  },
];
