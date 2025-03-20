"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Box, Minus, ShoppingCart, Ticket } from "lucide-react";

const CartStatus = () => {
  const cartPosition = useCartStore((state) => state.cartPosition);
  const setCartPosition = useCartStore((state) => state.setCartPosition);

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <ShoppingCart
        size={25}
        className={cn(
          "cursor-pointer",
          cartPosition === "Order" ? "text-primary" : "text-gray-400",
          cartPosition === "Checkout" && "text-primary",
          cartPosition === "Success" && "text-primary"
        )}
        onClick={() => setCartPosition("Order")}
      />
      <Minus
        className={cn(
          cartPosition === "Checkout" ? "text-primary" : "text-gray-400",
          cartPosition === "Success" && "text-primary"
        )}
      />
      <Ticket
        size={25}
        className={cn(
          "cursor-pointer",
          cartPosition === "Checkout" ? "text-primary" : "text-gray-400",
          cartPosition === "Success" && "text-primary"
        )}
        onClick={() => setCartPosition("Checkout")}
      />
      <Minus
        className={cn(
          cartPosition === "Success" ? "text-primary" : "text-gray-400"
        )}
      />
      <Box
        size={25}
        className={cn(
          "cursor-pointer",
          cartPosition === "Success" ? "text-primary" : "text-gray-400"
        )}
        onClick={() => setCartPosition("Success")}
      />
    </div>
  );
};

export default CartStatus;
