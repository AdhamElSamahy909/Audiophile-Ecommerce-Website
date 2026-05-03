import { getProducts } from "@/features/products/queries";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products = await getProducts(category.replace(/s$/, ""));
  console.log(`${category} products:`, products);

  return (
    <div>
      <h1>Category: {category}</h1>
      <div>Products ({products.length})</div>
    </div>
  );
}
