"use client";

import OrderDetails from "@/app/dashboard/orders/order-details";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { changeOrderStatusAction } from "@/server/actions/order-actions";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type Payment = {
  id: number;
  total: number;
  status: string;
  created: Date;
  receiptURL: string;
};

const ActionCell = ({ row }: { row: Row<Payment> }) => {
  const handleChangeStatus = async (status: string, id: number) => {
    const response = await changeOrderStatusAction(status, id);
    if ("success" in response) toast.success(response.success);
    if ("error" in response) toast.error(response.error);
  };

  const payment = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        >
          Change Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="data-[highlighted]:bg-blue-500 data-[highlighted]:text-white cursor-pointer"
          onClick={() => handleChangeStatus("PENDING", payment.id)}
        >
          PENDING
        </DropdownMenuItem>
        <DropdownMenuItem
          className="data-[highlighted]:bg-green-500 data-[highlighted]:text-white cursor-pointer"
          onClick={() => handleChangeStatus("COMPLETE", payment.id)}
        >
          COMPLETE
        </DropdownMenuItem>
        <DropdownMenuItem
          className="data-[highlighted]:bg-red-500 data-[highlighted]:text-white cursor-pointer"
          onClick={() => handleChangeStatus("CANCEL", payment.id)}
        >
          CANCEL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const adminColumns: ColumnDef<Payment>[] = [
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
    accessorKey: "details",
    header: () => <div className="text-end pe-7">Details</div>,
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
  {
    accessorKey: "actions",
    header: () => <div className="text-end pe-5">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-end">
          <ActionCell row={row} />
        </div>
      );
    },
  },
];
