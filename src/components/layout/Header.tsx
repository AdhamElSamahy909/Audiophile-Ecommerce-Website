"use client";

import Link from "next/link";
// import { getSession } from "@/features/auth/session";
import { logoutAction } from "@/features/auth/actions";
import useScreenWidth from "@/hooks/useScreenWidth";
import Image from "next/image";
import { Menu, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import useGetPathname from "@/hooks/useGetPathname";

const NAV_LINKS = [
  { label: "home", href: "/" },
  { label: "headphones", href: "/headphones" },
  { label: "speakers", href: "/speakers" },
  { label: "earphones", href: "/earphones" },
];

export default function Header() {
  const screenWidth = useScreenWidth();
  const pathname = useGetPathname();
  // const user = await getSession();

  return (
    <header
      className={`w-full ${pathname === "home" ? "h-[60rem] md:h-[73rem]" : ""} ${pathname === "home" ? `bg-[url('/assets/home/${screenWidth}/image-header.jpg')] bg-cover bg-bottom md:bg-center bg-no-repeat` : "bg-black"}`}
    >
      <div className="w-full max-w-[1110px] mx-auto px-[2.4rem] md:px-[4rem] lg:px-0">
        <nav className="flex justify-between items-center text-white py-[3.2rem] border-b border-white/10 relative z-50">
          <div className="flex items-center gap-[4.2rem] flex-1 md:flex-none">
            <Menu className="lg:hidden cursor-pointer" />
            <Link href="/" className="mx-auto md:mx-0">
              <Image
                src="/assets/shared/desktop/logo.svg"
                alt="logo"
                width={143}
                height={25}
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-[3.4rem]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[1.3rem] font-bold leading-[2.5rem] tracking-[0.2rem] uppercase hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <ShoppingCart className="cursor-pointer" />
        </nav>
      </div>

      {pathname === "home" && (
        <div className="w-full max-w-[1110px] mx-auto px-[2.4rem] md:px-[4rem] lg:px-0 h-[calc(100%-9rem)] flex items-center justify-center lg:justify-start">
          <div className="flex flex-col items-center lg:items-start gap-[2.4rem] md:gap-[2.4rem] text-white w-full md:w-[39.6rem] mx-auto lg:mx-0 translate-y-[2rem] md:translate-y-[-4rem]">
            <p className="uppercase text-[1.4rem] tracking-[1rem] opacity-50 mb-[0.8rem] md:mb-0">
              new product
            </p>
            <h1 className="text-[3.6rem] md:text-[5.6rem] tracking-[0.13rem] md:tracking-[0.2rem] leading-[4rem] md:leading-[5.8rem] font-bold uppercase text-center lg:text-left mb-[0.8rem] md:mb-0">
              XX99 Mark II
              <br className="hidden md:block lg:hidden" />
              Headphones
            </h1>
            <p className="text-[1.5rem] leading-[2.5rem] text-center lg:text-left opacity-75 mb-[1.2rem] md:mb-[1.6rem]">
              Experience natural, lifelike audio and exceptional build quality
              made for the passionate music enthusiast.
            </p>

            <Button variant="primary">see product</Button>
          </div>
        </div>
      )}
    </header>
  );
}
