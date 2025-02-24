import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const emailVerificationToken = pgTable(
  "email_verification_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expire: timestamp("expire", { mode: "date" }).notNull(),
    email: text("email").notNull().unique(),
  },
  (vt) => ({ compoundKey: primaryKey({ columns: [vt.id, vt.token] }) })
);

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: text("id")
      .notNull()
      .$default(() => createId()),
    token: text("token").notNull(),
    expire: timestamp("expire", { mode: "date" }).notNull(),
    email: text("email").notNull().unique(),
  },
  (vt) => ({ compoundKey: primaryKey({ columns: [vt.id, vt.token] }) })
);

export const twoFactorAuthCode = pgTable(
  "two_factor_code",
  {
    id: text("id")
      .notNull()
      .$default(() => createId()),
    code: text("code").notNull(),
    expire: timestamp("expire", { mode: "date" }).notNull(),
    email: text("email").notNull().unique(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (vt) => ({ compoundKey: primaryKey({ columns: [vt.id, vt.code] }) })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  // real to store floating point and ingeter to store whole number
  price: real("price").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  // serial is meant for primary keys, not foreign keys. Use integer() instead
  productId: integer("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const variantTags = pgTable("variant_tags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: integer("veriantId").references(() => variants.id, {
    onDelete: "cascade",
  }),
});

export const variantImages = pgTable("variant_images", {
  id: serial("id").primaryKey(),
  image_url: text("image_url").notNull(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  order: real("order").notNull(),
  variantId: integer("variantId")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
});

export const productRelations = relations(products, ({ many }) => ({
  variants: many(variants),
}));

export const variantRelations = relations(variants, ({ many, one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  variantImages: many(variantImages),
  variantTags: many(variantTags),
}));

export const variantTagRelations = relations(variantTags, ({ one }) => ({
  variant: one(variants, {
    fields: [variantTags.variantId],
    references: [variants.id],
  }),
}));

export const variantImageRelations = relations(variantImages, ({ one }) => ({
  variant: one(variants, {
    fields: [variantImages.variantId],
    references: [variants.id],
  }),
}));
