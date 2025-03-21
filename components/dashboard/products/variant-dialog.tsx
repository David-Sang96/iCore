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
import {
  createOrUpdateVariantAction,
  deleteVaraintAction,
} from "@/server/actions/product-actions";
import { variantSchema } from "@/utils/schema-types/variant-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TagsInput from "./tags-input";
import VariantImagesUploader from "./variant-images-uploader";

type VariantDialogProps = {
  children: ReactNode;
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImagesAndTags;
};

const VariantDialog = ({
  children,
  editMode,
  productId,
  variant,
}: VariantDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      tags: [
        "iPhone",
        "iPad",
        "MacBook",
        "Apple Watch",
        "Android Phone",
        "Accessories",
        "Cover",
      ],
      images: [],
      color: "#000000",
      editMode: false,
      productId,
      id: undefined,
      productType: "Black",
    },
  });

  useEffect(() => {
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("color", variant.color);
      form.setValue("productId", variant.productId);
      form.setValue(
        "images",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: Number(img.size),
          url: img.image_url,
          key: img.key,
        }))
      );
      form.setValue("productType", variant.productType);
      form.setValue(
        "tags",
        variant.variantTags.map((t) => t.tag)
      );
    }
  }, [editMode, variant]);

  const { execute, status } = useAction(createOrUpdateVariantAction, {
    onSuccess({ data }) {
      setOpen((open) => !open);
      if (data?.success) {
        toast.success(data.success);
        form.reset();
      }
      if (data?.error) toast.error(data.error);
    },
  });

  const { execute: invoke, status: submitAction } = useAction(
    deleteVaraintAction,
    {
      onSuccess({ data }) {
        if (data?.success) {
          toast.success(data.success);
          setOpen(false);
        }
        if (data?.error) {
          toast.error(data.error);
          setOpen(false);
        }
      },
    }
  );

  // prettier-ignore
  const onSubmit = ({color,editMode,images,productId,productType,tags,id}: z.infer<typeof variantSchema>) => {
    execute({color,editMode,images,productId,productType,tags,id})
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-[40rem] overflow-y-scroll no-scrollbar sm:max-w-lg w-[96%] mx-auto">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update" : "Create"} Product Variant
          </DialogTitle>
          <DialogDescription>Manage your product's variant</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
              <VariantImagesUploader />
              <div className="flex items-center gap-2 max-sm:flex-col">
                {editMode && (
                  <Button
                    className={cn(
                      "w-full",
                      submitAction === "executing" && "animate-pulse"
                    )}
                    disabled={
                      submitAction === "executing" || !form.formState.isValid
                    }
                    type="button"
                    variant={"destructive"}
                    onClick={(e) => {
                      e.preventDefault();
                      invoke({
                        id: variant?.id!,
                        key: variant?.variantImages.length
                          ? variant.variantImages.map((img) => ({
                              key: img.key,
                            }))
                          : [],
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  className={cn(
                    "w-full",
                    status === "executing" && "animate-pulse"
                  )}
                  disabled={status === "executing" || !form.formState.isValid}
                  type="submit"
                >
                  {editMode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default VariantDialog;
