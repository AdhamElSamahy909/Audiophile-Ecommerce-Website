import { getProducts } from "@/features/products/queries";

export default async function Page() {
  const products = await getProducts("earphones");
  console.log("Earphones:", products);

  return <div>Earphones ({products.length})</div>;
}
