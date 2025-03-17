ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_productVariantId_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" ALTER COLUMN "productId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "orderId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "variantId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customerId" text;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_variantId_variants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProduct" DROP COLUMN "productVariantId";