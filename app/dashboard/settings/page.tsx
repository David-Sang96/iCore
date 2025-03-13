import ProfileCard from "@/components/dashboard/settings/profile-card";
import ProfileLogoutPage from "@/components/dashboard/settings/profile-logout";
import ProfileResetPasswordPage from "@/components/dashboard/settings/reset-password";
import SettingsCard from "@/components/dashboard/settings/setting-card";
import TwoFactorAuthenticationPage from "@/components/dashboard/settings/two-factor";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await auth(); //auth() is server-only - Get session on the server
  if (!session?.user) return redirect("/");

  return (
    <SettingsCard title="Settings" description="Manage your account settings">
      <section
        className={cn(
          "grid gap-4 md:grid-cols-2",
          session.user.isOAuth && "flex flex-col gap-3"
        )}
      >
        <ProfileCard session={session} />
        {!session.user.isOAuth && (
          <>
            <TwoFactorAuthenticationPage
              isTwoFactorEnable={session.user.isTwoFactorEnabled}
              email={session.user.email!}
            />
            <ProfileResetPasswordPage email={session.user.email!} />
          </>
        )}
        <div className={cn("", session.user.isOAuth && "h-full")}>
          <ProfileLogoutPage />
        </div>
      </section>
    </SettingsCard>
  );
};

export default SettingsPage;
