"use client";

import { useCartStore } from "@/store/cart-store";
import { PartyPopper } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/button";

const Success = () => {
  const cart = useCartStore((state) => state.cart);
  const setCartPosition = useCartStore((state) => state.setCartPosition);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  useEffect(() => {
    if (cart.length === 0) {
      setTimeout(() => setCartPosition("Order"), 5000);
    }
    if (cart.length > 0) setCartPosition("Order");
  }, []);

  return (
    <section className="text-center space-y-2 pt-2">
      <div className="flex item-center gap-3 justify-center">
        <PartyPopper
          size={26}
          className="animate-bounce"
          style={{ color: "orange", stroke: "red", fill: "yellow" }}
        />
        <h2 className="text-lg md:text-xl font-medium">
          Your payment is successful!
        </h2>
        <PartyPopper
          size={26}
          className="animate-bounce"
          style={{ color: "orange", stroke: "red", fill: "yellow" }}
        />
      </div>
      <p className="text-sm md:text-base pb-8 ">Thank you for your purchase.</p>
      <Button asChild variant={"outline"} onClick={setIsOpen}>
        <Link href={"/dashboard/orders"}>View Orders</Link>
      </Button>
    </section>
  );
};

export default Success;
