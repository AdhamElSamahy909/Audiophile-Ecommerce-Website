import Image from "next/image";
import Link from "next/link";
import React from "react";

const classes = {
  primary:
    "w-[16rem] h-[4.8rem] flex items-center justify-center bg-accent hover:bg-accent-light text-[1.3rem] text-white uppercase tracking-[0.1rem]",
  secondary1:
    "w-[16rem] h-[4.8rem] flex items-center justify-center bg-black text-[1.3rem] text-white font-bold uppercase tracking-[0.1rem]",
  secondary2:
    "w-[16rem] h-[4.8rem] flex items-center justify-center bg-transparent text-[1.3rem] text-black font-bold uppercase tracking-[0.1rem] border border-black",
  tertiary:
    "uppercase tracking-[0.1rem] text-black text-[1.3rem] opacity-50 hover:color-accent",
};

function Button({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "primary" | "secondary1" | "secondary2" | "tertiary";
}) {
  return (
    <>
      {variant === "tertiary" ? (
        <Link
          href={"/"}
          className={classes[variant] + " flex items-center justify-center"}
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
        <Link href={"/"} className={classes[variant]}>
          {children}
        </Link>
      )}
    </>
  );
}

export default Button;
