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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantsWithImagesAndTags } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import { createVariantAction } from "@/server/actions/product-actions";
import { variantSchema } from "@/utils/schema-types/variant-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TagsInput from "./tags-input";
import VariantImages from "./variant-images";

type VariantDialogProps = {
  children: ReactNode;
  editMode: boolean;
  productId?: number;
  variants?: VariantsWithImagesAndTags;
};

const VariantDialog = ({
  children,
  editMode,
  productId,
  variants,
}: VariantDialogProps) => {
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000",
      editMode: false,
      productId,
      id: undefined,
      productType: "Black",
    },
  });

  const { execute, status } = useAction(createVariantAction, {
    onSuccess({ data }) {},
  });

  const onSubmit = ({}: z.infer<typeof variantSchema>) => {};

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[40rem] overflow-y-scroll no-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update" : "Create"} Product Variant
          </DialogTitle>
          <DialogDescription>Manage your product's variant</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter varaint title..."
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Tags</FormLabel>
                    <FormControl>
                      <TagsInput
                        values={field.value}
                        handleOnChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <Button
                className={cn(
                  "w-full",
                  status === "executing" && "animate-pulse"
                )}
                disabled={status === "executing"}
              >
                {editMode ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default VariantDialog;
