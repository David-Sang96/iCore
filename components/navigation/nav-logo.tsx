import { Store } from "lucide-react";
import Link from "next/link";

const NavLogo = () => {
  return (
    <Link href={"/"} className="text-xl md:text-3xl font-bold text-primary">
      <Store className="size-8 md:size-10" aria-label="Home" />
    </Link>
  );
};

export default NavLogo;
