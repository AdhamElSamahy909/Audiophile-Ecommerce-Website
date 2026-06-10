"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartWithTotal } from "../queries";

export function useCart(
  userId: string,
  mode: "interactive" | "strict" = "interactive",
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["cart", userId, mode],
    queryFn: () => getCartWithTotal(),
    // enabled: !!userId,

    initialData: () => {
      if (mode === "strict") {
        return queryClient.getQueryData(["cart", userId, "interactive"]);
      }
      return undefined;
    },
  });
}
