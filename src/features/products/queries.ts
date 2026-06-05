import { db } from "@/server/db";
// import { products } from "@/server/db/schema";

export async function getProducts(category: string) {
  const products = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.category, category),
  });

  return products;
}

export async function getProductById(productIdOrSlug: string) {
  try {
    const product = await db.query.products.findFirst({
      where: (products, { eq, or }) =>
        or(
          // we keep standard uuid eq if it looks like uuid, or just use slug directly. Actually, postgres will throw an error if comparing text to uuid.
          // Let's just use slug to check it. If the user passes a slug from `other.slug`, it works!
          // To be safe, try slug only!
          eq(products.slug, productIdOrSlug),
        ),
      with: {
        images: true,
        includedItems: true,
        others: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product by ID/Slug:", error);
    // If querying by slug fails (e.g., if it was an old UUID link), fallback to querying by UUID if valid
    try {
      const fallbackProduct = await db.query.products.findFirst({
        where: (products, { eq }) => eq(products.id, productIdOrSlug),
        with: {
          images: true,
          includedItems: true,
          others: true,
        },
      });
      return fallbackProduct;
    } catch {
      return null;
    }
  }
}
