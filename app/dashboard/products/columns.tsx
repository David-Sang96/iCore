"use client";

import VariantDialog from "@/components/dashboard/products/variant-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VariantsWithImagesAndTags } from "@/lib/infer-types";
import { deleteProductAction } from "@/server/actions/product-actions";

import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, CirclePlus, MoreHorizontal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type Product = {
  id: number;
  price: number;
  title: string;
  description: string;
  image: string;
  variants: VariantsWithImagesAndTags[];
};

const ActionsCell = ({ row }: { row: Row<Product> }) => {
  const [open, setOpen] = useState(false);
  const { execute, status } = useAction(deleteProductAction, {
    onSuccess({ data }) {
      if (data?.success) toast.success(data.success);
      if (data?.error) toast.error(data.error);
    },
  });
  const product = row.original;

  const imageKeys = product.variants
    .flatMap((item) => item.variantImages)
    .flatMap((item) => ({ key: item.key }));

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-sm:w-[95%] mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                execute({
                  id: product.id,
                  imageKeys,
                });
                setOpen(false);
              }}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu modal={false}>
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
            onClick={() => setOpen(true)}
            disabled={status === "executing"}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
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
      return (
        <div className="size-12 overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={50}
            height={50}
            className="object-cover w-full h-full"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "variants",
    header: () => <div className="text-start">Variants</div>,
    cell({ row }) {
      const product = row.original;
      const variants = row.getValue("variants") as VariantsWithImagesAndTags[];
      return (
        <div className="flex items-center gap-1">
          {variants.map((v, idx) => (
            <VariantDialog
              editMode
              productId={product.id}
              variant={v}
              key={idx}
            >
              <div
                className="size-5 rounded-full"
                style={{ background: v.color }}
              />
            </VariantDialog>
          ))}
          <VariantDialog editMode={false} productId={product.id}>
            <CirclePlus
              className="size-5 text-[hsl(var(--foreground))] duration-200 cursor-pointer"
              aria-label="open model"
            />
          </VariantDialog>
        </div>
      );
    },
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
