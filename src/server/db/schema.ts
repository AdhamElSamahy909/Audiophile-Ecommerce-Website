import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("name").notNull().unique(),
  passwordhash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenHash: text("token_hash").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    familyId: uuid("family_id").notNull(),
    isUsed: boolean("is_used").default(false).notNull(),
    deviceHash: text("device_hash"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("refresh_tokens_token_idx").on(table.tokenHash),
    index("refresh_tokens_family_idx").on(table.familyId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull().unique(),

  category: text("category").notNull(),
  new: boolean("new").default(true).notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  features: text("features").notNull(),

  mainMobileImage: text("main_mobile_image").notNull(),
  mainTabletImage: text("main_tablet_image").notNull(),
  mainDesktopImage: text("main_desktop_image").notNull(),

  categoryMobileImage: text("category_mobile_image").notNull(),
  categoryTabletImage: text("category_tablet_image").notNull(),
  categoryDesktopImage: text("category_desktop_image").notNull(),
});

export const productsGalleryImages = pgTable("products_gallery_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),

  position: text("position").notNull(),

  desktopImg: text("desktop_img").notNull(),
  tabletImg: text("tablet_img").notNull(),
  mobileImg: text("mobile_img").notNull(),
});

export const includedItems = pgTable("included_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),

  item: text("item").notNull(),
  quantity: integer("quantity").notNull(),
});

export const otherProducts = pgTable("other_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),

  desktopImg: text("desktop_img").notNull(),
  tabletImg: text("tablet_img").notNull(),
  mobileImg: text("mobile_img").notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productsGalleryImages),
  includedItems: many(includedItems),
  others: many(otherProducts),
  cartItems: many(cartItems),
}));

export const productsGalleryImagesRelations = relations(
  productsGalleryImages,
  ({ one }) => ({
    productImage: one(products, {
      fields: [productsGalleryImages.productId],
      references: [products.id],
    }),
  }),
);

export const includedItemsRelations = relations(includedItems, ({ one }) => ({
  product: one(products, {
    fields: [includedItems.productId],
    references: [products.id],
  }),
}));

export const otherProductsRelations = relations(otherProducts, ({ one }) => ({
  product: one(products, {
    fields: [otherProducts.productId],
    references: [products.id],
  }),
}));

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_itmes", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id")
    .references(() => carts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
