import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "HEADPHONES", href: "/headphones" },
  { name: "SPEAKERS", href: "/speakers" },
  { name: "EARPHONES", href: "/earphones" },
];

const socialLinks = [
  {
    name: "facebook",
    icon: "/assets/shared/desktop/icon-facebook.svg",
    href: "#",
  },
  {
    name: "twitter",
    icon: "/assets/shared/desktop/icon-twitter.svg",
    href: "#",
  },
  {
    name: "instagram",
    icon: "/assets/shared/desktop/icon-instagram.svg",
    href: "#",
  },
];

function Footer() {
  return (
    <footer className="bg-[#101010] text-white">
      <div className="w-[85%] max-w-[1110px] mx-auto relative pb-12 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="w-[100px] h-[4px] bg-accent absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0" />

        <div className="pt-12 md:pt-16 flex flex-col lg:flex-row lg:justify-between w-full items-center md:items-start lg:items-center gap-12 lg:gap-0">
          <Image
            src="/assets/shared/desktop/logo.svg"
            alt="Audiophile"
            width={143}
            height={25}
          />

          <nav className="flex flex-col md:flex-row gap-6 md:gap-8 items-center cursor-pointer">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold tracking-[2px] transition-colors hover:text-accent uppercase"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-12 text-white/50 max-w-[327px] md:max-w-2xl lg:max-w-[540px] text-[15px] leading-relaxed mx-auto md:mx-0">
          Audiophile is an all in one stop to fulfill your audio needs.
          We&apos;re a small team of music lovers and sound specialists who are
          devoted to helping you get the most out of personal audio. Come and
          visit our demo facility - we’re open 7 days a week.
        </p>

        <div className="mt-12 flex flex-col md:flex-row md:justify-between items-center w-full gap-12 md:gap-0">
          <p className="text-white/50 font-bold text-[15px]">
            Copyright 2021. All Rights Reserved
          </p>

          <div className="flex gap-4 lg:absolute lg:right-0 lg:mt-[-4rem]">
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.href}>
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={24}
                  height={24}
                  className="hover:brightness-0 hover:invert-0 hover:sepia hover:saturate-[1000] hover:hue-rotate-[340deg] transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
