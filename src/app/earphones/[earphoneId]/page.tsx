import { getProductById } from "@/features/products/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ earphoneId: string }>;
}) {
  const { earphoneId } = await params;
  const product = await getProductById(earphoneId);
  console.log("Earphone Detail:", product);

  return <div>Earphone Details: {product?.id}</div>;
}
