"use client";

import { createPaymentIntent } from "@/features/checkout/actions";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "@/features/checkout/components/ChekoutForm";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing from environment variables!",
  );
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing from environment variables!",
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function PaymentWrappet() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    createPaymentIntent()
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((err) => console.error("Failed to initialize payment: ", err));
  }, []);

  if (!clientSecret) {
    return (
      <div className="w-full h-32 flex items-center justify-center animate-pulse bg-gray-100 rounded-lg">
        <p className="text-gray-500 font-medium">
          Preparing secure checkout...
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}

export default PaymentWrappet;
