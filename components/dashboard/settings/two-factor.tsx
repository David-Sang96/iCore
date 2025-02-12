"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { twoFactorAuthAction } from "@/server/actions/setting-actions";
import { twoFactorSchema } from "@/utils/schema-types/setting-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import SettingsCard from "./setting-card";

type TwoFactorAuthenticationPageProps = {
  isTwoFactorEnable: boolean;
  email: string;
};

const TwoFactorAuthenticationPage = ({
  isTwoFactorEnable,
  email,
}: TwoFactorAuthenticationPageProps) => {
  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { isTwoFactorEnable, email },
  });

  const { execute, status } = useAction(twoFactorAuthAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
      } else if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const onSubmit = ({
    isTwoFactorEnable,
    email,
  }: z.infer<typeof twoFactorSchema>) => {
    execute({ isTwoFactorEnable, email });
  };

  return (
    <SettingsCard>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="isTwoFactorEnable"
            render={({ field }) => (
              <FormItem className="md:space-y-0">
                <div className="flex justify-between items-center">
                  <FormLabel>Two Facetor Authenticaion</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={status === "executing"}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  {isTwoFactorEnable ? "Disable" : "Enable"} Two Factor
                  Authenticaion for your account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={status === "executing"}
            className={cn(
              "w-full mt-3 md:mt-4",
              status === "executing" && "animate-pulse",
              isTwoFactorEnable ? "bg-red-600 hover:bg-red-500" : "bg-primary"
            )}
          >
            {isTwoFactorEnable ? "Disable" : "Enable"}
          </Button>
        </form>
      </Form>
    </SettingsCard>
  );
};

export default TwoFactorAuthenticationPage;
