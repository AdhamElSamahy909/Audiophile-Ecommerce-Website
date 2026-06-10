import { getSession } from "@/features/auth/session";
import { getCartWithTotal } from "@/features/cart/queries";
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

async function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["cart", user?.id as string],
    queryFn: getCartWithTotal,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export default CheckoutProvider;
