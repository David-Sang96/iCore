import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { Check, X } from "lucide-react";
import SettingsCard from "./setting-card";

const TwoFactorAuthenticationPage = async () => {
  const session = await auth();

  return (
    <SettingsCard>
      <div className="flex justify-between items-center">
        <div>Two Factor Authentication</div>
        {!session?.user.isTwoFactorEnabled ? (
          <Button size={"sm"} className="gap-0.5">
            <Check aria-hidden="true" />
            On
          </Button>
        ) : (
          <Button size={"sm"} className="bg-red-600 hover:bg-red-500 gap-0.5">
            <X aria-hidden="true" />
            Off
          </Button>
        )}
      </div>
    </SettingsCard>
  );
};

export default TwoFactorAuthenticationPage;
