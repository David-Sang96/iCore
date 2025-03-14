import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ReactNode } from "react";
import CartItem from "./cart-item";

type CartDrawerProps = {
  children: ReactNode;
};

const CartDrawer = ({ children }: CartDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger className="ring-0">{children}</DrawerTrigger>
      <DrawerContent className="xl:w-4/5 2xl:w-3/5 lg:mx-auto">
        <DrawerHeader>
          <CartItem />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
