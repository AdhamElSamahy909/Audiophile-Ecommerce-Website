import { getProducts } from "@/features/products/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products = await getProducts(category.replace(/s$/, ""));
  console.log(
    `${category.charAt(0).toUpperCase() + category.slice(1)}s:`,
    products,
  );

  return <div>Products ({products.length})</div>;
}
