"use server";

import { actionClient } from "@/lib/safe-action";
import { paymentSchema } from "@/utils/schema-types/payment-schema-type";
import Stripe from "stripe";
import { auth } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const processPayment = actionClient
  .schema(paymentSchema)
  .action(async ({ parsedInput: { amount, cart, currency } }) => {
    const user = await auth();
    if (!user) return { error: "You are not allowed to perfom this action" };
    if (!amount) return { error: "No product in cart" };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart: JSON.stringify(cart),
      },
    });
    return {
      success: {
        successPaymentId: paymentIntent.id,
        clientSecretId: paymentIntent.client_secret,
        user_email: user.user.email,
      },
    };
  });
