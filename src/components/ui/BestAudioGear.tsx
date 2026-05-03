"use client";

import Image from "next/image";
import Container from "./Container";
import useScreenWidth from "@/hooks/useScreenWidth";

function BestAudioGear() {
  const screenWidth = useScreenWidth();

  return (
    <Container>
      <div className="w-full flex flex-col lg:flex-row-reverse items-center justify-between gap-[4rem] lg:gap-[12.5rem]">
        <div className="w-full lg:w-1/2 h-[300px] md:h-[300px] lg:h-[588px] relative rounded-lg overflow-hidden">
          <Image
            src={`/assets/shared/${screenWidth}/image-best-gear.jpg`}
            alt="Best Gear"
            fill
            className="object-cover object-center hidden lg:block"
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-[3.2rem] md:px-[5.8rem] lg:px-0">
          <h3 className="text-black text-[2.8rem] md:text-[4rem] text-center lg:text-left font-bold tracking-[0.1rem] uppercase leading-[3.8rem] md:leading-[4.4rem]">
            Bringing you the <span className="text-accent">best</span> audio
            gear
          </h3>
          <p className="text-black text-center lg:text-left text-[1.5rem] leading-[2.5rem] opacity-50">
            Located at the heart of New York City, Audiophile is the premier
            store for high end headphones, earphones, speakers, and audio
            accessories. We have a large showroom and luxury demonstration rooms
            available for you to browse and experience a wide range of our
            products. Stop by our store to meet some of the fantastic people who
            make Audiophile the best place to buy your portable audio equipment.
          </p>
        </div>
      </div>
    </Container>
  );
}

export default BestAudioGear;
