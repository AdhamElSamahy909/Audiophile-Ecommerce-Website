import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart as addToCartDb } from "../actions";

export function useAddToCart(userId: string) {
  const queryClient = useQueryClient();

  const { mutate: addToCart } = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => addToCartDb(productId, quantity),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },
  });

  return { addToCart };
}
