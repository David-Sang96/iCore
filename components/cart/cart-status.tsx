"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Box, Minus, ShoppingCart, Ticket } from "lucide-react";

const CartStatus = () => {
  const orderStatus = useCartStore((state) => state.orderStatus);
  const setStatus = useCartStore((state) => state.setOrderStatus);

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <ShoppingCart
        size={25}
        className={cn(
          "cursor-pointer",
          orderStatus === "Order" ? "text-primary" : "text-gray-400",
          orderStatus === "Checkout" && "text-primary",
          orderStatus === "Success" && "text-primary"
        )}
        onClick={() => setStatus("Order")}
      />
      <Minus
        className={cn(
          orderStatus === "Checkout" ? "text-primary" : "text-gray-400",
          orderStatus === "Success" && "text-primary"
        )}
      />
      <Ticket
        size={25}
        className={cn(
          "cursor-pointer",
          orderStatus === "Checkout" ? "text-primary" : "text-gray-400",
          orderStatus === "Success" && "text-primary"
        )}
        onClick={() => setStatus("Checkout")}
      />
      <Minus
        className={cn(
          orderStatus === "Success" ? "text-primary" : "text-gray-400"
        )}
      />
      <Box
        size={25}
        className={cn(
          "cursor-pointer",
          orderStatus === "Success" ? "text-primary" : "text-gray-400"
        )}
        onClick={() => setStatus("Success")}
      />
    </div>
  );
};

export default CartStatus;
