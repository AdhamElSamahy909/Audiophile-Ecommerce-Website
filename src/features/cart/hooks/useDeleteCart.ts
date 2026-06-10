import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCart as deleteCartDb } from "../actions";
import { CartWithTotal } from "@/server/db/schema";

export function useDeleteCart(userId: string) {
  const queryClient = useQueryClient();

  const { mutate: deleteFromCart, isPending } = useMutation({
    mutationFn: ({ cartId }: { cartId: string }) => deleteCartDb(cartId),

    onMutate: async ({ cartId }) => {
      await queryClient.cancelQueries({
        queryKey: ["cart", userId, "interactive"],
      });

      const previousCart = queryClient.getQueryData([
        "cart",
        userId,
        "interactive",
      ]);

      queryClient.setQueryData(
        ["cart", userId, "interactive"],
        (oldCart: CartWithTotal | undefined) => {
          if (!oldCart) return oldCart;

          return { ...oldCart, items: [], totalPrice: 0 };
        },
      );

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", userId], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  return { deleteFromCart, isDeleting: isPending };
}
