import { getProducts } from "@/features/products/queries";

export default async function Page() {
  const products = await getProducts("headphones");
  console.log("Headphones:", products);

  return <div>Headphones ({products.length})</div>;
}
