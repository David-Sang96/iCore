"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { loginAction } from "@/server/actions/auth-actions";
import { loginSchema } from "@/utils/schema-types/auth-schema-type";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { toast } from "sonner";

const LoginPage = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { execute, result, status } = useAction(loginAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
        form.reset();
      } else if (data?.error?.includes("email")) {
        toast.error(data?.error, {
          action: {
            label: "Open Gmail",
            onClick() {
              window.open("https://mail.google.com", "_blank");
            },
          },
        });
      } else if (data?.error) {
        toast.error(data?.error);
      }
    },
  });

  const onSubmit = ({ email, password }: z.infer<typeof loginSchema>) => {
    execute({ email, password });
  };

  return (
    <AuthForm
      formTitle="Login to your account"
      showProvider
      footerLabel="Don't have an account?"
      footerHref="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@email.com"
                    {...field}
                    className="text-sm"
                    disabled={status === "executing"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    className="text-sm"
                    type="password"
                    disabled={status === "executing"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" text-end text-[#884DEE] hover:underline hover:underline-offset-4 text-sm">
            <Link href={"/auth/reset-email"}>Forget password?</Link>
          </div>

          <Button
            type="submit"
            className={cn("w-full", status === "executing" && "animate-pulse")}
            disabled={status === "executing"}
          >
            Login
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default LoginPage;
