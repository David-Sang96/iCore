"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  createOrUpdateProductAction,
  getOneProductAction,
} from "@/server/actions/product-actions";
import { productSchema } from "@/utils/schema-types/product-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TipTap from "./tip-tap";

const CreateProductForm = () => {
  const isEditMode = useSearchParams().get("edit_id") || null;
  const router = useRouter();
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      isChecked: false,
    },
  });

  const { execute, status } = useAction(createOrUpdateProductAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
        if (!form.getValues("isChecked")) router.push("/dashboard/products");
        form.reset();
        form.setValue("description", "");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const product = async () => {
        const { error, success } = await getOneProductAction(
          Number(isEditMode)
        );
        if (error) {
          toast.error(error);
          router.push("/dashboard/products");
          return;
        }
        if (success) {
          form.setValue("id", success.id);
          form.setValue("title", success.title);
          form.setValue("price", success.price);
          form.setValue("description", success.description);
        }
      };
      product();
    } else {
      form.reset();
      form.setValue("description", "");
    }
  }, [isEditMode]);

  const onSubmit = ({
    title,
    description,
    price,
    id,
  }: z.infer<typeof productSchema>) => {
    execute({ title, description, price, id });
  };

  return (
    <Card>
      <CardHeader className="p-2.5 md:p-4 pb-0">
        <CardTitle>{isEditMode ? "Update" : "Create"} Product</CardTitle>
        <CardDescription>
          {isEditMode ? "Update" : "Create"} a new product
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2.5 md:p-4 md:pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="T-shirt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <TipTap value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        <DollarSign size={17} className="bg-muted" />
                        <Input
                          placeholder="T-shirt"
                          {...field}
                          type="number"
                          // step={100}
                          min={0}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="isChecked"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2 justify-end mt-2">
                          <Checkbox
                            id="terms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Stay on this page
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button
              className={cn(
                "w-full mt-4",
                status === "executing" && "animate-pulse",
                !form.formState.isDirty &&
                  "bg-gray-300 text-gray-600 select-none"
              )}
              disabled={status === "executing" || !form.formState.isDirty}
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;
