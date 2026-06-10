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
import { useCart } from "@/features/cart/hooks/useCart";
import { useUpdateCart } from "@/features/cart/hooks/useUpdateCart";
import { useDeleteCart } from "@/features/cart/hooks/useDeleteCart";

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

const formatProductName = (name: string) => {
  let formatted = name
    .replace(/(Headphones|Earphones|Speaker|Wireless)/gi, "")
    .trim();
  formatted = formatted.replace(/Mark One/gi, "MK I");
  formatted = formatted.replace(/Mark Two/gi, "MK II");
  return formatted;
};

export default function Header() {
  const screenWidth = useScreenWidth();
  const pathname = useGetPathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const user = useAuth((state) => state.user);
  const clearUser = useAuth((state) => state.clearUser);
  const { data: cart } = useCart(user?.id as string, "interactive");
  const { updateCart, isUpdating } = useUpdateCart(user?.id as string);
  const { deleteFromCart, isDeleting } = useDeleteCart(user?.id as string);

  console.log("Cart in Header: ", cart);
  const isCartEmpty = !cart || cart.items.length === 0;

  const handleLogout = async () => {
    await logoutAction();
    setShowUserMenu(false);
    clearUser();
  };

  const handleUpdateCart = (productId: string, quantity: number) => {
    updateCart({ cartId: cart?.id as string, productId, quantity });
  };

  const handleDeleteCart = (cartId: string) => {
    deleteFromCart({ cartId });
    setShowCartModal(false);
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
            <div className="relative">
              <ShoppingCart
                className="cursor-pointer hover:text-accent transition-colors"
                onClick={() => setShowCartModal(!showCartModal)}
              />
              {cart?.items && cart.items.length > 0 ? (
                <span className="absolute -top-[0.8rem] -right-[0.8rem] bg-accent text-white text-[1rem] font-bold w-[1.8rem] h-[1.8rem] flex items-center justify-center rounded-full">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              ) : null}
              {showCartModal && (
                <div className="absolute top-[4.5rem] right-0 bg-white shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-[0.8rem] min-w-[37.7rem] z-50 p-[3.2rem]">
                  <div className="flex justify-between items-center mb-[3.2rem]">
                    <h6 className="text-black text-[1.8rem] font-bold uppercase tracking-[0.13rem]">
                      CART ({cart?.items?.length || 0})
                    </h6>
                    {!isCartEmpty && (
                      <button
                        className="text-black/50 text-[1.5rem] hover:text-accent underline transition-colors"
                        onClick={() => handleDeleteCart(cart?.id as string)}
                      >
                        Remove all
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-[2.4rem] mb-[3.2rem] max-h-[24rem] overflow-y-auto">
                    {cart?.items && cart.items.length > 0 ? (
                      cart.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-[1.6rem]"
                        >
                          <div className="w-[6.4rem] h-[6.4rem] rounded-[0.8rem] bg-[#f1f1f1] overflow-hidden flex items-center justify-center">
                            <Image
                              src={`/assets/cart/image-${item.product.slug}.jpg`}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="w-[4.2rem] h-[4.2rem] object-contain flex-shrink-0"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 flex flex-col text-black justify-center">
                            <span className="text-[1.5rem] font-bold leading-[2.5rem]">
                              {formatProductName(item.product.name)}
                            </span>
                            <span className="text-[1.4rem] font-bold opacity-50 leading-[2.5rem]">
                              $ {item.product.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center bg-[#F1F1F1] h-[3.2rem] w-[9.6rem] justify-between px-[1.1rem]">
                            <button
                              onClick={() =>
                                handleUpdateCart(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="text-black/25 hover:text-accent font-bold text-[1.3rem] tracking-[1px]"
                            >
                              -
                            </button>
                            <span className="text-black font-bold text-[1.3rem]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateCart(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="text-black/25 hover:text-accent font-bold text-[1.3rem] tracking-[1px]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-black/50 text-center text-[1.5rem]">
                        Your cart is empty
                      </p>
                    )}
                  </div>

                  {!isCartEmpty && (
                    <>
                      <div className="flex justify-between items-center mb-[2.4rem]">
                        <span className="text-black/50 text-[1.5rem] uppercase">
                          Total
                        </span>
                        <span className="text-black text-[1.8rem] font-bold">
                          ${(cart?.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        href="/checkout"
                        className={`w-full ${isUpdating || isDeleting ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={() => setShowCartModal(false)}
                      >
                        checkout
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
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
