"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { Button } from "../ui/button";

const ProviderLogin = () => {
  return (
    <div className="space-y-1.5 pb-4">
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Login with google
        <FcGoogle aria-hidden />
      </Button>

      <Button
        className="w-full"
        variant={"outline"}
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Login with github <RxGithubLogo aria-hidden />
      </Button>
    </div>
  );
};

export default ProviderLogin;
