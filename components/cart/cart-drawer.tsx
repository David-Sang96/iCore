"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCartStore } from "@/store/cart-store";
import { ReactNode } from "react";
import CartItem from "./cart-item";
import CartStatus from "./cart-status";
import Payment from "./payment";
import Success from "./success";

type CartDrawerProps = {
  children: ReactNode;
};

const CartDrawer = ({ children }: CartDrawerProps) => {
  const cartPosition = useCartStore((state) => state.cartPosition);
  const cart = useCartStore((state) => state.cart);
  const open = useCartStore((state) => state.isOpen);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerTrigger className="ring-0">{children}</DrawerTrigger>
      <DrawerContent className="xl:w-4/5 2xl:w-3/5 lg:mx-auto pb-3 ">
        <DrawerHeader className="pt-0 px-3">
          <DrawerTitle>Items in your cart</DrawerTitle>
          {cart.length > 0 && <CartStatus />}
          {cartPosition === "Order" && <CartItem />}
          {cartPosition === "Checkout" && <Payment />}
          {cartPosition === "Success" && <Success />}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
