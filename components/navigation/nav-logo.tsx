import { Apple } from "lucide-react";
import Link from "next/link";

const NavLogo = () => {
  return (
    <Link
      href={"/"}
      className="text-xl md:text-3xl font-bold text-primary font-mono flex items-center gap-1"
    >
      <Apple className="size-8 md:size-9 fill-primary" aria-label="Home" />
      <span className="text-4xl">iCore</span>
    </Link>
  );
};

export default NavLogo;
