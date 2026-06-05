import {
  products,
  productsGalleryImages,
  includedItems,
  otherProducts,
} from "./schema";
import { db } from ".";

import rawData from "../../features/products/data.json";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    for (const item of rawData) {
      console.log(`Inserting product: ${item.name}`);

      // 1. Insert the main product and get the generated UUID
      const [insertedProduct] = await db
        .insert(products)
        .values({
          slug: item.slug,
          name: item.name,
          category: item.category,
          new: item.new,
          price: item.price,
          description: item.description,
          features: item.features,
          mainMobileImage: item.image.mobile,
          mainTabletImage: item.image.tablet,
          mainDesktopImage: item.image.desktop,
          categoryMobileImage: item.categoryImage.mobile,
          categoryTabletImage: item.categoryImage.tablet,
          categoryDesktopImage: item.categoryImage.desktop,
        })
        .returning({ id: products.id });

      const productId = insertedProduct.id;

      // 2. Insert Gallery Images
      const galleryInserts = Object.entries(item.gallery).map(
        ([position, images]) => ({
          productId,
          position,
          mobileImg: images.mobile,
          tabletImg: images.tablet,
          desktopImg: images.desktop,
        }),
      );

      if (galleryInserts.length > 0) {
        await db.insert(productsGalleryImages).values(galleryInserts);
      }

      // 3. Insert Included Items
      if (item.includes && item.includes.length > 0) {
        const includesInserts = item.includes.map((inc) => ({
          productId,
          item: inc.item,
          quantity: inc.quantity,
        }));
        await db.insert(includedItems).values(includesInserts);
      }

      // 4. Insert Other Products (Recommendations)
      if (item.others && item.others.length > 0) {
        const othersInserts = item.others.map((other) => ({
          productId,
          slug: other.slug,
          name: other.name,
          mobileImg: other.image.mobile,
          tabletImg: other.image.tablet,
          desktopImg: other.image.desktop,
        }));
        await db.insert(otherProducts).values(othersInserts);
      }
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

seed();
