import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  integer,
  pgEnum,
  decimal,
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
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("refresh_tokens_token_idx").on(table.tokenHash),
    index("refresh_tokens_family_idx").on(table.familyId),
  ],
);

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

export const paymentMethodEnum = pgEnum("payment_method", [
  "COD",
  "CREDIT_CARD",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "FAILED",
]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull(),

  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),

  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("PENDING")
    .notNull(),

  stripeSessionId: varchar("stripe_session_id", { length: 255 }).unique(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),

  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  orders: many(orders),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productsGalleryImages),
  includedItems: many(includedItems),
  others: many(otherProducts),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
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

export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type Product = typeof products.$inferSelect;
export type User = typeof users.$inferSelect;
