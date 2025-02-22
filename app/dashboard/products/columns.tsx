"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProductAction } from "@/server/actions/product-actions";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export type Product = {
  id: number;
  price: number;
  title: string;
  description: string;
  image: string;
  variants: any;
};

const ActionsCell = ({ row }: { row: Row<Product> }) => {
  const product = row.original;

  const { execute, status } = useAction(deleteProductAction, {
    onSuccess({ data }) {
      if (data?.success) toast.success(data.success);
      if (data?.error) toast.error(data.error);
    },
  });

  return (
    <DropdownMenu>
      <div className="text-end">
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer focus:bg-primary/70 focus:text-white duration-200"
          asChild
        >
          <Link href={`/dashboard/create-product?edit_id=${product.id}`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-red-500/70 focus:text-white duration-200"
          onClick={() => execute({ id: product.id })}
          disabled={status === "executing"}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell({ row }) {
      const image = row.getValue("image") as string;
      const title = row.getValue("title") as string;
      return <Image src={image} alt={title} width={50} height={50} />;
    },
  },
  {
    accessorKey: "variants",
    header: () => <div className="text-center">Variants</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        className="text-start p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown />
      </Button>
    ),
    cell({ row }) {
      const title = row.getValue("title") as string;
      return <div className="font-medium">{title}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant={"ghost"}
        className="p-0 text-start"
      >
        Price
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className=" font-medium text-start">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-end">Actions</div>,
    cell({ row }) {
      return <ActionsCell row={row} />;
    },
  },
];
