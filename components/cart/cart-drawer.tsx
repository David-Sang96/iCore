"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
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
  const cartStatus = useCartStore((state) => state.orderStatus);
  const cart = useCartStore((state) => state.cart);

  return (
    <Drawer>
      <DrawerTrigger className="ring-0">{children}</DrawerTrigger>
      <DrawerContent className="xl:w-4/5 2xl:w-3/5 lg:mx-auto">
        <DrawerHeader>
          {/* <DrawerTitle>Products in your cart</DrawerTitle> */}
          {cart.length > 0 && <CartStatus />}
          {cartStatus === "Order" && <CartItem />}
          {cartStatus === "Checkout" && <Payment />}
          {cartStatus === "Success" && <Success />}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
