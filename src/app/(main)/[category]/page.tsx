import { getProducts } from "@/features/products/queries";
import CategoryPage from "@/features/products/CategoryPage";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products = await getProducts(category);
  console.log(`${category} products:`, products);

  if (!products || products.length === 0) notFound();

  return <CategoryPage products={products} />;
}
