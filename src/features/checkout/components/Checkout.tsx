"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/features/cart/hooks/useCart";
import CartItems from "@/features/cart/components/CartItems";
import { CheckoutForm } from "@stripe/react-stripe-js/checkout";
import PaymentWrappet from "@/components/providers/PaymentWrappet";

export default function Checkout() {
  const user = useAuth((state) => state.user);
  const { data: cart } = useCart(user?.id as string, "strict");
  console.log("cart: ", cart);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<
    "e-Money" | "Cash on Delivery"
  >("e-Money");

  return (
    <div className="max-w-[111rem] mx-auto w-full">
      <button
        onClick={() => router.back()}
        className="text-[1.5rem] leading-[2.5rem] text-black opacity-50 mb-[2.4rem] md:mb-[4.8rem] hover:text-accent hover:opacity-100 transition-colors"
      >
        Go Back
      </button>

      <div className="flex flex-col lg:flex-row gap-[3.2rem]">
        <div className="bg-white rounded-[0.8rem] p-[2.4rem] md:p-[4.8rem] w-full lg:w-[73rem] flex-shrink-0">
          <h1 className="text-[2.8rem] md:text-[3.2rem] leading-[3.6rem] md:leading-[3.6rem] tracking-[0.1rem] md:tracking-[0.114rem] font-bold text-black uppercase mb-[3.2rem] md:mb-[4.1rem]">
            Checkout
          </h1>

          <form className="flex flex-col gap-[3.2rem] md:gap-[5.3rem]">
            {/* Billing Details */}
            <div className="flex flex-col gap-[1.6rem]">
              <h2 className="text-[1.3rem] leading-[2.5rem] tracking-[0.093rem] font-bold text-accent uppercase subtitle">
                Billing Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem]">
                <div className="flex flex-col gap-[0.9rem]">
                  <label
                    htmlFor="name"
                    className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Alexei Ward"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-[0.9rem]">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="email"
                      className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                    >
                      Email Address
                    </label>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="alexei@mail.com"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-[0.9rem]">
                  <label
                    htmlFor="phone"
                    className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+1 202-555-0136"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="flex flex-col gap-[1.6rem]">
              <h2 className="text-[1.3rem] leading-[2.5rem] tracking-[0.093rem] font-bold text-accent uppercase subtitle">
                Shipping Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem]">
                <div className="flex flex-col gap-[0.9rem] md:col-span-2">
                  <label
                    htmlFor="address"
                    className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="1137 Williams Avenue"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-[0.9rem]">
                  <label
                    htmlFor="zip"
                    className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    placeholder="10001"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-[0.9rem]">
                  <label
                    htmlFor="city"
                    className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    placeholder="New York"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex flex-col gap-[0.9rem]">
                  <label
                    htmlFor="country"
                    className="text-[1.2rem] font-bold tracking-[-0.021rem]"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    placeholder="United States"
                    className="h-[5.6rem] px-[2.4rem] border border-[#cfcfcf] rounded-[0.8rem] text-[1.4rem] font-bold tracking-[-0.025rem] focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="flex flex-col gap-[1.6rem]">
              <h2 className="text-[1.3rem] leading-[2.5rem] tracking-[0.093rem] font-bold text-accent uppercase subtitle">
                Payment Details
              </h2>

              <div className="flex flex-col md:flex-row gap-[1.6rem] md:justify-between">
                <div className="flex flex-col gap-[0.9rem] w-full md:w-[50%]">
                  <label className="text-[1.2rem] font-bold tracking-[-0.021rem]">
                    Payment Method
                  </label>
                </div>

                <div className="flex flex-col gap-[1.6rem] w-full md:w-[50%]">
                  <label
                    className={`cursor-pointer h-[5.6rem] px-[2.4rem] border rounded-[0.8rem] flex items-center gap-[1.6rem] transition-colors ${paymentMethod === "e-Money" ? "border-accent" : "border-[#cfcfcf]"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="e-Money"
                      checked={paymentMethod === "e-Money"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="accent-accent w-[2rem] h-[2rem]"
                    />
                    <span className="text-[1.4rem] font-bold tracking-[-0.025rem]">
                      Card Payment
                    </span>
                  </label>
                  <label
                    className={`cursor-pointer h-[5.6rem] px-[2.4rem] border rounded-[0.8rem] flex items-center gap-[1.6rem] transition-colors ${paymentMethod === "Cash on Delivery" ? "border-accent" : "border-[#cfcfcf]"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="accent-accent w-[2rem] h-[2rem]"
                    />
                    <span className="text-[1.4rem] font-bold tracking-[-0.025rem]">
                      Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>

              {paymentMethod === "e-Money" && <PaymentWrappet />}

              {paymentMethod === "Cash on Delivery" && (
                <div className="flex gap-[3.2rem] items-center mt-[3.2rem]">
                  <Image
                    src="/assets/checkout/icon-cash-on-delivery.svg"
                    alt="cash on delivery"
                    width={48}
                    height={48}
                  />
                  <p className="text-[1.5rem] leading-[2.5rem] opacity-50 text-black">
                    The 'Cash on Delivery' option enables you to pay in cash
                    when our delivery courier arrives at your residence. Just
                    make sure your address is correct so that your order will
                    not be cancelled.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-[0.8rem] p-[2.4rem] md:p-[3.2rem] w-full lg:w-[35rem] h-fit">
          <h2 className="text-[1.8rem] font-bold tracking-[0.129rem] uppercase mb-[3.2rem]">
            Summary
          </h2>

          <CartItems items={cart?.items} />

          <div className="flex flex-col gap-[0.8rem] mb-[2.4rem]">
            <div className="flex justify-between items-center">
              <span className="text-[1.5rem] leading-[2.5rem] uppercase opacity-50">
                Total
              </span>
              <span className="text-[1.8rem] font-bold">
                $ {(cart?.totalPrice || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[1.5rem] leading-[2.5rem] uppercase opacity-50">
                Shipping
              </span>
              <span className="text-[1.8rem] font-bold">$ 50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[1.5rem] leading-[2.5rem] uppercase opacity-50">
                VAT (Included)
              </span>
              <span className="text-[1.8rem] font-bold">
                $ {Math.round((cart?.totalPrice || 0) * 0.2).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-[3.2rem]">
            <span className="text-[1.5rem] leading-[2.5rem] uppercase opacity-50">
              Grand Total
            </span>
            <span className="text-[1.8rem] font-bold text-accent">
              $ {((cart?.totalPrice || 0) + 50).toLocaleString()}
            </span>
          </div>

          <button className="w-full h-[4.8rem] bg-accent hover:bg-accent-light text-white text-[1.3rem] font-bold tracking-[0.1rem] uppercase transition-colors">
            Continue & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
