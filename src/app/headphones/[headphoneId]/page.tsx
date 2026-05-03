import { getProductById } from "@/features/products/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ headphoneId: string }>;
}) {
  const { headphoneId } = await params;
  const product = await getProductById(headphoneId);
  console.log("Headphone Detail:", product);

  return <div>Headphone Details: {product?.id}</div>;
}
