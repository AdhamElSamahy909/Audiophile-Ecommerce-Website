"use client";

import React, { useState } from "react";
import Image from "next/image";
import BestAudioGear from "@/components/ui/BestAudioGear";
import CategoryList from "@/components/ui/CategoryList";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Product } from "@/server/db/schema";
import useScreenWidth from "@/hooks/useScreenWidth";
// import { addToCart } from "../cart/actions";
import { useAddToCart } from "../cart/hooks/useAddToCart";
import { useAuth } from "@/components/providers/AuthProvider";

type ProductWithRelations = Product & {
  images?: {
    id: string;
    position: string;
    desktopImg: string;
    tabletImg: string;
    mobileImg: string;
  }[];
  includedItems?: { id: string; item: string; quantity: number }[];
  others?: {
    id: string;
    productId: string;
    name: string;
    slug: string;
    desktopImg: string;
    tabletImg: string;
    mobileImg: string;
  }[];
};

export default function ProductDetails({
  product,
}: {
  product: ProductWithRelations;
}) {
  const screenWidth = useScreenWidth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuth((state) => state.user);
  const { addToCart } = useAddToCart(user?.id as string);

  const deskImg = product.mainDesktopImage.replace("./assets", "/assets");
  const tabImg = product.mainTabletImage.replace("./assets", "/assets");
  const mobImg = product.mainMobileImage.replace("./assets", "/assets");

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const firstImg = product.images?.find((img) => img.position === "first");
  const secondImg = product.images?.find((img) => img.position === "second");
  const thirdImg = product.images?.find((img) => img.position === "third");

  function handleAddToCart() {
    setIsLoading(true);
    addToCart({ productId: product.id, quantity });
    setIsLoading(false);
  }

  return (
    <>
      <Container>
        <div className="mb-[3.2rem] md:mb-[4.7rem] lg:mb-[6.4rem]">
          <button
            onClick={() => router.back()}
            className="text-[1.5rem] font-medium leading-[2.5rem] text-black/50 hover:text-accent transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>

        <div className="flex flex-col gap-[3.2rem] mb-[8.8rem] md:flex-row md:items-center md:gap-[6.9rem] md:mb-[12rem] lg:gap-[12.5rem] lg:mb-[16rem]">
          <div className="w-full shrink-0 rounded-[0.8rem] bg-[#F1F1F1] flex items-center justify-center overflow-hidden h-[32.7rem] md:w-[28.1rem] md:h-[48rem] lg:w-[54rem] lg:h-[56rem]">
            <Image
              src={mobImg.replace("/mobile/", `/${screenWidth}/`)}
              alt={product.name}
              width={1080}
              height={1080}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col items-start text-left">
            {product.new && (
              <p className="text-accent tracking-[1rem] text-[1.4rem] font-normal uppercase mb-[2.4rem] md:mb-[1.6rem]">
                New Product
              </p>
            )}
            <h1 className="text-[2.8rem] md:text-[4rem] font-bold uppercase leading-[1.15] tracking-[0.1rem] md:tracking-[0.15rem] mb-[2.4rem] md:mb-[3.2rem] lg:max-w-[44.5rem]">
              {product.name}
            </h1>
            <p className="text-[1.5rem] leading-[2.5rem] font-medium text-black/50 mb-[2.4rem] md:mb-[3.2rem] lg:max-w-[44.5rem]">
              {product.description}
            </p>
            <div className="text-[1.8rem] font-bold tracking-[0.13rem] uppercase mb-[3.2rem] md:mb-[4.7rem]">
              $ {product.price.toLocaleString()}
            </div>

            <div className="flex flex-row items-center gap-[1.6rem]">
              <div className="w-[12rem] h-[4.8rem] bg-[#F1F1F1] flex items-center justify-between px-[1.6rem]">
                <button
                  onClick={decrement}
                  className="text-[1.3rem] font-bold text-black/25 hover:text-accent transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="text-[1.3rem] font-bold">{quantity}</span>
                <button
                  onClick={increment}
                  className="text-[1.3rem] font-bold text-black/25 hover:text-accent transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <Button
                variant="primary"
                href="#"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* ── Features + In the Box ── */}
        <div className="flex flex-col mb-[8.8rem] md:mb-[12rem] lg:flex-row lg:mb-[16rem]">
          {/* Features */}
          <div className="w-full flex flex-col mb-[8.8rem] md:mb-[12rem] lg:w-[63.5rem] lg:mr-[12.5rem] lg:mb-0">
            <h3 className="text-[2.4rem] font-bold uppercase leading-[3.6rem] tracking-[0.086rem] mb-[2.4rem] md:text-[3.2rem] md:tracking-[0.114rem] md:mb-[3.2rem]">
              Features
            </h3>
            <p className="text-[1.5rem] leading-[2.5rem] font-medium text-black/50 whitespace-pre-line">
              {product.features}
            </p>
          </div>

          {/* In the Box */}
          <div className="w-full flex flex-col gap-[2.4rem] md:flex-row lg:flex-1 lg:flex-col lg:gap-[3.2rem]">
            <h3 className="text-[2.4rem] font-bold uppercase leading-[3.6rem] tracking-[0.086rem] shrink-0 mb-0 md:text-[3.2rem] md:tracking-[0.114rem]">
              In the Box
            </h3>
            <ul className="flex flex-col gap-[0.8rem] md:flex-1 lg:flex-initial">
              {product.includedItems?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center"
                  style={{ gap: "2.4rem" }}
                >
                  <span className="text-accent text-[1.5rem] font-bold leading-[2.5rem] min-w-[2.5rem]">
                    {item.quantity}x
                  </span>
                  <span className="text-black/50 text-[1.5rem] font-medium leading-[2.5rem]">
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Image Gallery ── */}
        <div className="flex flex-col gap-[2rem] mb-[12rem] md:flex-row md:gap-[1.8rem] lg:gap-[3rem] lg:mb-[16rem]">
          {/* Left column: two stacked images */}
          <div className="flex flex-col gap-[2rem] md:w-[40%] md:gap-[1.8rem] lg:gap-[3rem]">
            {firstImg && (
              <div className="rounded-[0.8rem] overflow-hidden">
                <Image
                  src={firstImg.mobileImg
                    .replace("./", "/")
                    .replace("/mobile/", `/${screenWidth}/`)}
                  alt="Gallery image 1"
                  width={1080}
                  height={1080}
                  className="w-full h-[17.4rem] object-cover lg:h-[28rem] block"
                />
              </div>
            )}
            {secondImg && (
              <div className="rounded-[0.8rem] overflow-hidden">
                <Image
                  src={secondImg.mobileImg
                    .replace("./", "/")
                    .replace("/mobile/", `/${screenWidth}/`)}
                  alt="Gallery image 2"
                  width={1080}
                  height={1080}
                  className="w-full h-[17.4rem] object-cover lg:h-[28rem] block"
                />
              </div>
            )}
          </div>

          {/* Right column: one tall image */}
          {thirdImg && (
            <div className="rounded-[0.8rem] overflow-hidden md:flex-1">
              <Image
                src={thirdImg.mobileImg
                  .replace("./", "/")
                  .replace("/mobile/", `/${screenWidth}/`)}
                alt="Gallery image 3"
                width={1080}
                height={1080}
                className="w-full h-[36.8rem] object-cover md:h-full block"
              />
            </div>
          )}
        </div>

        {/* ── You May Also Like ── */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-[2.4rem] font-bold uppercase leading-[3.6rem] tracking-[0.086rem] mb-[4rem] md:text-[3.2rem] md:tracking-[0.114rem] md:mb-[5.6rem] lg:mb-[6.4rem]">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 gap-[5.6rem] w-full md:grid-cols-3 md:gap-[1.1rem] lg:gap-[3rem]">
            {product.others?.map((other) => (
              <div key={other.id} className="flex flex-col items-center w-full">
                <div className="w-full bg-[#F1F1F1] rounded-[0.8rem] flex justify-center items-center mb-[3.2rem] h-[12rem] md:mb-[4rem] md:h-[31.8rem]">
                  <Image
                    src={other.mobileImg
                      .replace("./", "/")
                      .replace("/mobile/", `/${screenWidth}/`)}
                    alt={other.name}
                    width={500}
                    height={500}
                    className="h-[9rem] w-auto object-contain md:h-[18rem] lg:h-[22rem]"
                  />
                </div>
                <h4 className="text-[2.4rem] font-bold uppercase tracking-[0.17rem] leading-normal mb-[3.2rem]">
                  {other.name}
                </h4>
                <Button
                  variant="primary"
                  href={`/${product.category}/${other.slug}`}
                >
                  See Product
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <CategoryList />
      <BestAudioGear />
    </>
  );
}
