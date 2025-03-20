"use client";

import stripInit from "@/lib/stripe-init";
import { useCartStore } from "@/store/cart-store";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import PaymentForm from "./payment-form";

const stripe = stripInit();

const Payment = () => {
  const cart = useCartStore((state) => state.cart);
  const setCartPosition = useCartStore((state) => state.setCartPosition);
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.variant.quantity,
    0
  );

  useEffect(() => {
    if (cart.length === 0) setCartPosition("Order");
  }, []);

  return (
    <div>
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: totalPrice,
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </div>
  );
};

export default Payment;
