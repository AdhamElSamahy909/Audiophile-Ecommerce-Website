"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import useScreenWidth from "@/hooks/useScreenWidth";
import Image from "next/image";
import { Menu, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import useGetPathname from "@/hooks/useGetPathname";
import { User } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

const NAV_LINKS = [
  { label: "home", href: "/" },
  { label: "headphones", href: "/headphones" },
  { label: "speakers", href: "/speakers" },
  { label: "earphones", href: "/earphones" },
];

const bgImageClasses: Record<string, string> = {
  mobile: "bg-[url('/assets/home/mobile/image-header.jpg')]",
  tablet: "bg-[url('/assets/home/tablet/image-header.jpg')]",
  desktop: "bg-[url('/assets/home/desktop/image-header.jpg')]",
};

export default function Header() {
  const screenWidth = useScreenWidth();
  const pathname = useGetPathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = useAuth((state) => state.user);
  const clearUser = useAuth((state) => state.clearUser);

  const handleLogout = async () => {
    await logoutAction();
    setShowUserMenu(false);
    clearUser();
  };

  console.log("User in Header: ", user);

  return (
    <header
      className={`w-full ${pathname === "home" ? "h-[60rem] md:h-[73rem]" : ""} ${pathname === "home" ? `${bgImageClasses[screenWidth]} bg-cover bg-bottom md:bg-center bg-no-repeat` : "bg-black"}`}
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

          <div className="flex items-center gap-[2.4rem]">
            <ShoppingCart className="cursor-pointer hover:text-accent transition-colors" />
            <div className="relative">
              <User
                className="cursor-pointer hover:text-accent transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              />
              {showUserMenu && (
                <div className="absolute top-[4.5rem] right-0 bg-white shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-[0.8rem] min-w-[15rem] z-50 overflow-hidden py-[0.8rem]">
                  {user ? (
                    <button
                      className="w-full text-left px-[2.4rem] py-[1.2rem] hover:text-accent transition-colors text-[1.3rem] font-bold uppercase tracking-[0.15rem] cursor-pointer text-black"
                      onClick={handleLogout}
                    >
                      logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full text-left px-[2.4rem] py-[1.2rem] hover:text-accent transition-colors text-[1.3rem] font-bold uppercase tracking-[0.15rem] text-black"
                      onClick={() => setShowUserMenu(false)}
                    >
                      login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
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

            <Button
              variant="primary"
              href="/headphones/xx99-mark-two-headphones"
            >
              see product
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
