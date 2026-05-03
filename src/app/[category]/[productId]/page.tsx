import { getProductById } from "@/features/products/queries";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductById(productId);

  return (
    <div>
      <h1>Product: {product?.name || productId}</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}
