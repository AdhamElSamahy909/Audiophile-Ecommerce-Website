"use client";

import { useQuery } from "@tanstack/react-query";
import { getCartWithTotal } from "./queries";

export function useCart(userId: string) {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCartWithTotal(),
    enabled: !!userId,
  });
}
