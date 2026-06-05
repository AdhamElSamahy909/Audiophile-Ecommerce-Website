import Image from "next/image";
import Link from "next/link";
import React from "react";

const classes = {
  primary:
    "w-[16rem] h-[4.8rem] flex items-center justify-center bg-accent hover:bg-accent-light text-[1.3rem] text-white uppercase tracking-[0.1rem]",
  secondary1:
    "w-[16rem] h-[4.8rem] flex items-center justify-center bg-black text-[1.3rem] text-white font-bold uppercase tracking-[0.1rem] border border-black hover:bg-gray hover:text-black",
  secondary2:
    "w-[16rem] h-[4.8rem] flex items-center justify-center bg-transparent text-[1.3rem] text-black font-bold uppercase tracking-[0.1rem] border border-black hover:bg-black hover:text-white",
  tertiary:
    "uppercase tracking-[0.1rem] text-black text-[1.3rem] opacity-50 hover:text-accent",
};

function Button({
  children,
  variant,
  href = "/",
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  variant: "primary" | "secondary1" | "secondary2" | "tertiary";
  href?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <>
      {variant === "tertiary" ? (
        <Link
          href={href}
          className={`${classes[variant]} flex items-center justify-center ${className || ""}`}
        >
          {children}
          <Image
            src="/assets/shared/desktop/icon-arrow-right.svg"
            alt="arrow right"
            width={5}
            height={10}
            className="ml-[1.2rem]"
          />
        </Link>
      ) : (
        <Link
          href={href}
          className={`${classes[variant]} ${className || ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={onClick}
          aria-disabled={disabled}
        >
          {children}
        </Link>
      )}
    </>
  );
}

export default Button;
