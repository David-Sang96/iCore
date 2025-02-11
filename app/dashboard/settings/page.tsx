import ProfileCard from "@/components/dashboard/settings/profile-card";
import ProfileResetPasswordPage from "@/components/dashboard/settings/reset-password";
import SettingsCard from "@/components/dashboard/settings/setting-card";
import TwoFactorAuthenticationPage from "@/components/dashboard/settings/two-factor";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await auth(); //auth() is server-only - Get session on the server
  if (!session?.user) return redirect("/");

  return (
    <SettingsCard title="Settings" description="Manage your account settings">
      <section className="grid gap-4 md:grid-cols-2">
        <ProfileCard session={session} />
        {!session.user.isOAuth && (
          <div className="space-y-4">
            <ProfileResetPasswordPage email={session.user.email!} />
            <TwoFactorAuthenticationPage
              isTwoFactorEnable={session.user.isTwoFactorEnabled}
              email={session.user.email!}
            />
          </div>
        )}
      </section>
    </SettingsCard>
  );
};

export default SettingsPage;
