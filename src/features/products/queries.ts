import { db } from "@/server/db";
// import { products } from "@/server/db/schema";

export async function getProducts(category: string) {
  const products = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.category, category),
  });

  return products;
}

export async function getProductById(productId: string) {
  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, productId),
  });

  return product;
}
