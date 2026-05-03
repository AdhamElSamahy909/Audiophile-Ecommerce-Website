"use client";

import { usePathname as useNextPathname } from "next/navigation";

export default function useGetPathname() {
  const pathname = useNextPathname();

  if (!pathname || pathname === "/") {
    return "home";
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0) {
    return segments[0];
  }

  return "home";
}
