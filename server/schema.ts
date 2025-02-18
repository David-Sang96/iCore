import { createId } from "@paralleldrive/cuid2";
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
