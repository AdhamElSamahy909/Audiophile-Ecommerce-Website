import { getProductById } from "@/features/products/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { category, productId } = await params;
  const product = await getProductById(productId);
  console.log("Product Detail:", product);

  return <div>Product: {product?.id}</div>;
}
