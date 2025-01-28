import { auth } from "@/server/auth";
import NavLogo from "./nav-logo";
import UserButton from "./user-button";

const AppNav = async () => {
  const sessions = await auth();

  return (
    <nav className="flex items-center justify-between py-1.5">
      <NavLogo />
      <UserButton user={sessions?.user} expires={sessions?.expires!} />
    </nav>
  );
};

export default AppNav;
