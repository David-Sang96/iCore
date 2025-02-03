ALTER TABLE "password_reset" RENAME TO "password_reset_token";--> statement-breakpoint
ALTER TABLE "password_reset_token" DROP CONSTRAINT "password_reset_email_unique";--> statement-breakpoint
ALTER TABLE "password_reset_token" DROP CONSTRAINT "password_reset_id_token_pk";--> statement-breakpoint
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_id_token_pk" PRIMARY KEY("id","token");--> statement-breakpoint
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_email_unique" UNIQUE("email");