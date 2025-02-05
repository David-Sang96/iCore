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
import { PasswordResetAction } from "@/server/actions/auth-actions";
import { passwordResetSchema } from "@/utils/schema-types/auth-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ResetPasswordPage = () => {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      token,
    },
  });

  const { execute, status } = useAction(PasswordResetAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
        router.push("/auth/login");
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const onSubmit = ({
    oldPassword,
    newPassword,
    confirmPassword,
    token,
  }: z.infer<typeof passwordResetSchema>) => {
    execute({ oldPassword, newPassword, confirmPassword, token });
  };

  return (
    <AuthForm
      formTitle="Reset your password"
      showProvider={false}
      footerLabel="Login here"
      footerHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    type="password"
                    disabled={status === "executing"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    type="password"
                    disabled={status === "executing"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    type="password"
                    disabled={status === "executing"}
                  />
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
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default ResetPasswordPage;
