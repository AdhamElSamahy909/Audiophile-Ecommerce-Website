import ProductDetails from "@/features/products/ProductDetails";
import { getProductById } from "@/features/products/queries";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { productId } = await params;
  console.log("Fetching product with ID: ", productId);
  const product = await getProductById(productId);

  console.log("Fetched product: ", product);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
