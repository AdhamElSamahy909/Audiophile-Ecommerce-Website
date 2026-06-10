import { getSession } from "@/features/auth/session";
import { getCartWithTotal } from "@/features/cart/queries";
import Checkout from "@/features/checkout/components/Checkout";
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

async function Page() {
  // const user = await getSession();
  // const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["cart", user?.id as string],
  //   queryFn: getCartWithTotal,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <div className="mt-[-12rem] mb-[-20rem] bg-gray-light -mx-[2.4rem] lg:-mx-[4rem] px-[2.4rem] lg:px-[4rem] py-[4rem] lg:py-[6rem]">
      <Checkout />
    </div>
    // </HydrationBoundary>
  );
}

export default Page;
