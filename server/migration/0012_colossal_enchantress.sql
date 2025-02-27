ALTER TABLE "variant_tags" RENAME COLUMN "veriantId" TO "variantId";--> statement-breakpoint
ALTER TABLE "variant_tags" DROP CONSTRAINT "variant_tags_veriantId_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "variant_tags" ADD CONSTRAINT "variant_tags_variantId_variants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;