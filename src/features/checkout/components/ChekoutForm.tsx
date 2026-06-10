"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { makePurchase } from "../actions";

function ChekoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    // e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again.",
      );
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await makePurchase({});
      router.push(`/checkout/success?payment_intent=${paymentIntent.id}`);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PaymentElement />

      {errorMessage && (
        <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md">
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing}
        className="w-full bg-[#D87D4A] hover:bg-[#FBAF85] transition-colors text-white font-bold tracking-[0.06em] uppercase py-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : "Pay & Continue"}
      </button>
    </div>
  );
}

export default ChekoutForm;
