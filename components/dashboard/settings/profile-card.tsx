"use client";

import { getFirstLetterInEachWord } from "@/components/navigation/user-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/useMediaQuery";
import { UserRoundPen } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import ProfileForm from "./profile-form";
import SettingsCard from "./setting-card";

type ProfileCardProps = {
  session: Session;
};

const ProfileCard = ({ session }: ProfileCardProps) => {
  console.log(session);
  const isDesktop = useMediaQuery("(min-width : 768px)");
  const [open, setOpen] = useState(false);

  return (
    <SettingsCard>
      <div className="flex justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar className="size-12 md:size-14">
            <AvatarImage src={session?.user?.image!} alt="profile picture" />
            <AvatarFallback className="bg-primary text-white font-medium">
              {getFirstLetterInEachWord(session?.user?.name!)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{session.user?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </div>
        <div>
          {isDesktop ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button size={"icon"}>
                  <UserRoundPen aria-label="edit profile" />
                </Button>
              </DialogTrigger>
              <DialogContent className="overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Update Profile Name</DialogTitle>
                  <DialogDescription>
                    This will be your public display name.
                  </DialogDescription>
                </DialogHeader>
                <ProfileForm
                  name={session.user?.name!}
                  email={session.user?.email!}
                  setOpen={setOpen}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"} className="w-full">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger>
                <Button size={"icon"}>
                  <UserRoundPen aria-label="edit profile" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Update Profile</DrawerTitle>
                  <DrawerDescription>
                    This will be your public display name.
                  </DrawerDescription>
                  <ProfileForm
                    name={session.user?.name!}
                    email={session.user?.email!}
                    setOpen={setOpen}
                  />
                  <DrawerClose>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </SettingsCard>
  );
};

export default ProfileCard;
