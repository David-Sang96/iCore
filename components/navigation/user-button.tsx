"use client";

import { LogIn, LogOut } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

const UserButton = ({ user }: Session) => {
  console.log(user);
  return (
    <div>
      {user?.email}
      {!user?.email ? (
        <Button className="px-2.5 text-sm" asChild>
          <Link href={"/auth/login"}>
            <LogIn />
            Login
          </Link>
        </Button>
      ) : (
        <Button
          variant={"destructive"}
          onClick={() => signOut()}
          className="px-2.5 text-sm"
        >
          <LogOut />
          Logout
        </Button>
      )}
    </div>
  );
};

export default UserButton;
