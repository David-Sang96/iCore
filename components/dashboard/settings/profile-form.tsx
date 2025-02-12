"use client";

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
import { updateProfileNameAction } from "@/server/actions/setting-actions";
import { updateProfileNameSchema } from "@/utils/schema-types/setting-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProfileFormProps = {
  name: string;
  email: string;
  setOpen: (val: boolean) => void;
};

const ProfileForm = ({ name, email, setOpen }: ProfileFormProps) => {
  const form = useForm<z.infer<typeof updateProfileNameSchema>>({
    resolver: zodResolver(updateProfileNameSchema),
    defaultValues: { username: name, email },
  });

  const { execute, status } = useAction(updateProfileNameAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
        setOpen(false);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const onSubmit = ({
    username,
    email,
  }: z.infer<typeof updateProfileNameSchema>) => {
    execute({ username, email });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="JohnDoe..."
                  autoFocus
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
          Update
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
