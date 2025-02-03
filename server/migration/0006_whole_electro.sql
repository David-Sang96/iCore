ALTER TABLE "password-reset" RENAME TO "password_reset";--> statement-breakpoint
ALTER TABLE "password_reset" DROP CONSTRAINT "password-reset_email_unique";--> statement-breakpoint
ALTER TABLE "password_reset" DROP CONSTRAINT "password-reset_id_token_pk";--> statement-breakpoint
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_id_token_pk" PRIMARY KEY("id","token");--> statement-breakpoint
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_email_unique" UNIQUE("email");