import { auth } from "@/server/auth";
import CartBtn from "../cart/cart-btn";
import NavLogo from "./nav-logo";
import UserButton from "./user-button";

const AppNav = async () => {
  const sessions = await auth();

  return (
    <nav className="flex items-center justify-between py-1.5">
      <NavLogo />
      <div className="flex items-center gap-5">
        <CartBtn />
        <UserButton user={sessions?.user} />
      </div>
    </nav>
  );
};

export default AppNav;
