CREATE TABLE "password-reset" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expire" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "password-reset_id_token_pk" PRIMARY KEY("id","token"),
	CONSTRAINT "password-reset_email_unique" UNIQUE("email")
);
