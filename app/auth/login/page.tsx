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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { loginAction } from "@/server/actions/auth-actions";
import { loginSchema } from "@/utils/schema-types/auth-schema-type";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const LoginPage = () => {
  const [is2FAOn, setIs2FAOn] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFACode: "",
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
      } else if (data?.twoFactorSuccess) {
        toast.success(data.twoFactorSuccess);
        setIs2FAOn(true);
      } else if (data?.twoFactorError) {
        toast.error(data.twoFactorError);
        form.setValue("twoFACode", "");
      }
    },
  });

  const onSubmit = ({
    email,
    password,
    twoFACode,
  }: z.infer<typeof loginSchema>) => {
    execute({ email, password, twoFACode });
  };

  return (
    <AuthForm
      formTitle={is2FAOn ? "Two factor code required" : "Login to your account"}
      showProvider
      footerLabel="Don't have an account?"
      footerHref="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!is2FAOn ? (
            <>
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
              <div className=" text-end hover:underline hover:underline-offset-4 text-sm">
                <Link href={"/auth/reset-email"}>Forget password?</Link>
              </div>
            </>
          ) : (
            <FormField
              control={form.control}
              name="twoFACode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your verificaiton code</FormLabel>
                  <FormControl className="mx-auto">
                    <InputOTP
                      maxLength={6}
                      {...field}
                      disabled={status === "executing"}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className={cn("w-full", status === "executing" && "animate-pulse")}
            disabled={status === "executing"}
          >
            {is2FAOn ? "Verify Code" : "Login"}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default LoginPage;
