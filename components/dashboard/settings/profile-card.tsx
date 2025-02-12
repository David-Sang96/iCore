"use client";

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
import { Mail, UserRound, UserRoundPen } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import ProfileForm from "./profile-form";
import SettingsCard from "./setting-card";
import UploadAvatarForm from "./upload-avatar-form";

type ProfileCardProps = {
  session: Session;
};

const ProfileCard = ({ session }: ProfileCardProps) => {
  const isDesktop = useMediaQuery("(min-width : 768px)");
  const [open, setOpen] = useState(false);

  return (
    <SettingsCard>
      <div className="flex md:justify-between">
        <div className="flex-1">
          <UploadAvatarForm
            image={session.user.image}
            name={session.user.name!}
            email={session.user.email!}
          />
          <div className="md:mt-3">
            <h2 className="text-sm flex gap-1">
              <div className="flex">
                <UserRound
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 2,
                    marginTop: 2,
                  }}
                />
                <span className="text-muted-foreground font-normal">Name:</span>
              </div>
              {session.user?.name}
            </h2>
            <p className="text-sm flex gap-1">
              <div className="flex">
                <Mail
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 2,
                    marginTop: 2,
                  }}
                />
                <span className="text-muted-foreground font-normal">
                  Email:
                </span>
              </div>

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
