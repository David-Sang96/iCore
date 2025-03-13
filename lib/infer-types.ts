import * as schema from "@/server/schema";
import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type VariantsWithImagesAndTags = InferResultType<
  "variants",
  { variantImages: true; variantTags: true }
>;

export type ProductsWithVariants = InferResultType<
  "products",
  { variants: true }
>;

export type VariantsWithProductsAndImagesAndTags = InferResultType<
  "variants",
  { product: true; variantImages: true; variantTags: true }
>;

export type ProductsWithVariantsAndImagesAndTags = InferResultType<
  "products",
  { variants: { with: { variantImages: true; variantTags: true } } }
>;
