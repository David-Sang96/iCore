"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
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
import { registerAction } from "@/server/actions/auth-actions";
import { registerSchema } from "@/utils/auth-schema-type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RegisterPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { execute, status, result } = useAction(registerAction, {
    onSuccess({ data }) {
      form.reset();
      toast.success(data?.success, {
        action: {
          label: "Open Gmail",
          onClick: () => {
            window.open("https://mail.google.com", "_blank");
          },
        },
      });
      router.push("/auth/login");
    },
  });

  const onSubmit = ({
    email,
    name,
    password,
  }: z.infer<typeof registerSchema>) => {
    execute({ name, email, password });
  };

  return (
    <AuthForm
      formTitle="Register account"
      showProvider
      footerLabel="Already have an account?"
      footerHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe..."
                    {...field}
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={cn("w-full", status === "executing" && "animate-pulse")}
          >
            Register
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default RegisterPage;
