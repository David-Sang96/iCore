"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { verifyEmail } from "@/server/actions/email-actions";
import AuthForm from "../auth/auth-form";

const Email = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerification = async () => {
    if (!token) return setError("Invalid token");

    const { success, error } = await verifyEmail(token);
    if (success) {
      setSuccess(success);
      router.push("/auth/login");
    }
    if (error) return setError(error);
  };

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <AuthForm
        formTitle="Verify Email"
        showProvider={false}
        footerLabel="Login to your account"
        footerHref="/auth/login"
      >
        <p
          className={cn(
            "text-center font-medium text-xl",
            success ? "text-primary" : error ? "text-red-500" : ""
          )}
        >
          {!success && !error
            ? "Confirming verification..."
            : success
              ? success
              : error}
        </p>
      </AuthForm>
    </div>
  );
};
export default Email;
