import { getProducts } from "@/features/products/queries";

export default async function Page() {
  const products = await getProducts("speakers");
  console.log("Speakers:", products);

  return <div>Speakers ({products.length})</div>;
}
