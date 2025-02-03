"use client";

import AuthForm from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
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
import { SendPasswordResetEmailAction } from "@/server/actions/auth-actions";
import { passwordResetEmailSchema } from "@/utils/auth-schema/auth-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SendPasswordResetEmailPage = () => {
  const form = useForm<z.infer<typeof passwordResetEmailSchema>>({
    resolver: zodResolver(passwordResetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(SendPasswordResetEmailAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success, {
          action: {
            label: "Open Gmail",
            onClick() {
              window.open("https://mail.google.com", "_blank");
            },
          },
        });
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const onSubmit = ({ email }: z.infer<typeof passwordResetEmailSchema>) => {
    execute({ email });
  };

  return (
    <AuthForm
      formTitle="Reset your password"
      showProvider={false}
      footerHref="/auth/login"
      footerLabel="Already have account? Login here"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={cn(
              "w-full mt-4",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            Send Email
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default SendPasswordResetEmailPage;
