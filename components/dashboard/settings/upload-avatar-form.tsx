"use client";

import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { getFirstLetterInEachWord } from "@/components/navigation/user-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { uploadProfileAvatarAction } from "@/server/actions/setting-actions";
import { avatarSchema } from "@/utils/schema-types/setting-schema-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type UploadAvatarFormProps = {
  image?: string;
  name: string;
  email: string;
};

const UploadAvatarForm = ({ image, name, email }: UploadAvatarFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<z.infer<typeof avatarSchema>>({
    resolver: zodResolver(avatarSchema),
    defaultValues: { image, email },
  });

  const { execute, status } = useAction(uploadProfileAvatarAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
      } else if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const onSubmit = (value: z.infer<typeof avatarSchema>) => {
    const { image, email } = value;
    execute({ image, email });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-3">
                  <Avatar className="size-12 md:size-14">
                    <AvatarImage
                      src={form.getValues("image") || image}
                      alt="profile picture"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      {getFirstLetterInEachWord(name)}
                    </AvatarFallback>
                  </Avatar>

                  <UploadButton
                    className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:ring-primary scale-75 !items-start"
                    endpoint={"imageUploader"}
                    onUploadBegin={() => {
                      setIsUploading(true);
                    }}
                    onUploadError={(err) => {
                      form.setError("image", {
                        type: "validate",
                        message: err.message,
                      });
                      setIsUploading(false);
                    }}
                    content={{
                      button({ ready }) {
                        return (
                          <div>{ready ? "Upload Avatar" : "Loading..."}</div>
                        );
                      },
                    }}
                    onClientUploadComplete={(response) => {
                      if (response.length > 0 && response[0]?.url) {
                        form.setValue("image", response[0].url);
                        form.handleSubmit(onSubmit)();
                      } else {
                        form.setError("image", {
                          type: "validate",
                          message: "Upload failed, please try again.",
                        });
                      }
                      setIsUploading(false);
                    }}
                  />
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default UploadAvatarForm;
