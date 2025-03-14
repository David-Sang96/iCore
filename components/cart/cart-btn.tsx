"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import CartDrawer from "./cart-drawer";

const CartBtn = () => {
  const totalCartItems = useCartStore((state) => state.cart.length);

  return (
    <CartDrawer>
      <div className="relative">
        <ShoppingCart style={{ width: 25, height: 25 }} strokeWidth={3} />
        <span className="absolute -top-1.5 -right-2 size-5 flex items-center justify-center bg-primary text-white rounded-full text-xs">
          {totalCartItems}
        </span>
      </div>
    </CartDrawer>
  );
};

export default CartBtn;
