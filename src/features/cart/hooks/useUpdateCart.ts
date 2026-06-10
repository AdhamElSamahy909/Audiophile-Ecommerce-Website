import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCart as updateCartDb } from "../actions";
import { CartWithTotal } from "@/server/db/schema";

export function useUpdateCart(userId: string) {
  const queryClient = useQueryClient();

  const { mutate: updateCart, isPending } = useMutation({
    mutationFn: ({
      cartId,
      productId,
      quantity,
    }: {
      cartId: string;
      productId: string;
      quantity: number;
    }) => updateCartDb(cartId, productId, quantity),

    onMutate: async ({ cartId, productId, quantity }) => {
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

          return {
            ...oldCart,
            items: oldCart.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: quantity }
                : item,
            ),
            totalPrice: oldCart.items.reduce((totalPrice, item) => {
              const itemQuantity =
                item.productId === productId ? quantity : item.quantity;
              return totalPrice + Number(itemQuantity * item.product.price);
            }, 0),
          };
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
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },
  });

  return { updateCart, isUpdating: isPending };
}
