"use client";

import { LogIn, LogOut, Settings, Truck } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const getFirstLetterInEachWord = (name: string) => {
  return name
    .split(" ")
    .filter((item) => item.length > 0)
    .map((item) => item.charAt(0).toUpperCase())
    .join("");
};

const UserButton = ({ user }: Session) => {
  const router = useRouter();

  return (
    <div>
      {!user?.email ? (
        <Button className="px-2.5 text-sm" asChild>
          <Link href={"/auth/login"}>
            <LogIn aria-hidden />
            Login
          </Link>
        </Button>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.image!} />
              <AvatarFallback className="bg-primary text-white font-medium">
                {getFirstLetterInEachWord(user.name!)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="md:px-3 p-2 ">
            <div className="flex items-center gap-2.5 p-2 mb-2 cursor-pointer hover:scale-95 duration-500 ease-in-out shadow-md border border-primary/20 rounded-md">
              <Avatar>
                <AvatarImage src={user.image!} />
                <AvatarFallback className="bg-primary text-white font-medium">
                  {getFirstLetterInEachWord(user.name!)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <h3 className="font-medium">{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="group hover:bg-primary/10 cursor-pointer "
              onClick={() => router.push("/dashboard/orders")}
            >
              <Truck
                aria-hidden="true"
                style={{ width: 21, height: 21, marginRight: 3 }}
                className="group-hover:translate-x-1 duration-500 group-hover:text-primary"
              />
              <span className="text-sm group-hover:text-primary">
                My Orders
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="group hover:bg-primary/10 cursor-pointer "
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings
                aria-hidden="true"
                style={{ width: 21, height: 21, marginRight: 3 }}
                className="group-hover:rotate-180 duration-500 group-hover:text-primary"
              />
              <span className="text-sm group-hover:text-primary">Setting</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer group hover:bg-primary/10"
              onClick={() => signOut()}
            >
              <LogOut
                aria-hidden="true"
                style={{ width: 21, height: 21, marginRight: 3 }}
                className="group-hover:translate-x-1 group-hover:scale-90 duration-500 group-hover:text-primary"
              />
              <span className="text-sm group-hover:text-primary">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserButton;
