"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import SettingsCard from "./setting-card";

const ProfileLogoutPage = () => {
  return (
    <SettingsCard>
      <Button className="bg-red-600 hover:bg-red-500" onClick={() => signOut()}>
        <LogOutIcon aria-hidden="true" />
        Logout
      </Button>
    </SettingsCard>
  );
};

export default ProfileLogoutPage;
