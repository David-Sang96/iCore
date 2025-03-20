"use client";

import { createOrderAction } from "@/server/actions/order-actions";
import { processPayment } from "@/server/actions/payment-actions";
import { useCartStore } from "@/store/cart-store";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAction } from "next-safe-action/hooks";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type PaymentFormProps = {
  totalPrice: number;
};

const PaymentForm = ({ totalPrice }: PaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const setCartPosition = useCartStore((state) => state.setCartPosition);
  const clearCart = useCartStore((state) => state.clearCart);
  const [errorMsg, setErrorMsg] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore((state) => state.cart);

  const { execute } = useAction(createOrderAction, {
    onSuccess({ data }) {
      if (data?.success) {
        setCartPosition("Success");
        clearCart();
        toast.success(data.success);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setLoading(false);
      setErrorMsg(submitError.message || "Something went wrong");
      return;
    }

    const responseData = await processPayment({
      amount: totalPrice * 100,
      currency: "usd",
      cart: cart.map((product) => ({
        quantity: product.variant.quantity,
        productId: product.id,
        image: product.image,
        price: +product.price,
        title: product.title,
      })),
    });

    if (responseData?.data?.error) {
      setErrorMsg(responseData.data.error);
      setLoading(false);
      return;
    }

    if (responseData?.data?.success) {
      const paymentResponse = await stripe.confirmPayment({
        elements,
        clientSecret: responseData.data.success.clientSecretId!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: responseData.data.success.user_email!,
        },
      });

      if (paymentResponse.error) {
        setErrorMsg(paymentResponse.error.message!);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        execute({
          paymentId: responseData.data.success.successPaymentId,
          totalPrice,
          status: "PENDING",
          products: cart.map((item) => ({
            productId: item.id,
            quantity: item.variant.quantity,
            variantId: item.variant.variantId,
          })),
        });
      }
    }
  };

  return (
    <>
      {errorMsg && (
        <p className="text-lg font-medium text-red-500">{errorMsg}</p>
      )}

      <form onSubmit={onSubmitHandler} className="space-y-5">
        <PaymentElement />
        <div className="flex justify-end">
          <Button
            disabled={loading || !stripe || !elements}
            className="px-24 max-sm:w-full"
          >
            Pay Now
          </Button>
        </div>
      </form>
    </>
  );
};

export default PaymentForm;
