"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SendPasswordResetEmailAction } from "@/server/actions/auth-actions";
import { passwordResetEmailSchema } from "@/utils/schema-types/auth-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { signOut } from "next-auth/react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsCard from "./setting-card";

type ProfileResetPasswordPageProps = {
  email: string;
};

const ProfileResetPasswordPage = ({ email }: ProfileResetPasswordPageProps) => {
  const form = useForm<z.infer<typeof passwordResetEmailSchema>>({
    resolver: zodResolver(passwordResetEmailSchema),
    defaultValues: {
      email: email ? email : undefined,
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
        setTimeout(() => {
          signOut({ callbackUrl: "/auth/login" });
        }, 3000);
      }
      if (data?.error) toast.error(data.error);
    },
  });

  const onSubmit = ({ email }: z.infer<typeof passwordResetEmailSchema>) => {
    execute({ email });
  };

  return (
    <SettingsCard>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            type="submit"
            className={cn("w-full", status === "executing" && "animate-pulse")}
            disabled={status === "executing"}
          >
            <Lock aria-hidden="true" />
            <span>Change Password</span>
          </Button>
        </form>
      </Form>
    </SettingsCard>
  );
};

export default ProfileResetPasswordPage;
