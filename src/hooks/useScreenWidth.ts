"use client";

import { useEffect, useState } from "react";

export default function useScreenWidth(): "mobile" | "tablet" | "desktop" {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (screenWidth < 768) {
    return "mobile";
  } else if (screenWidth < 1024) {
    return "tablet";
  } else {
    return "desktop";
  }
}
