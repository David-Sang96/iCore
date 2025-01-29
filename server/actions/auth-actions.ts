"use server";

import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { loginSchema, registerSchema } from "@/utils/auth-schema-type";
import { generateEmailVerificationToken } from "@/utils/tokens";
import { db } from "..";
import { users } from "../schema";

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const isUserExisted = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (isUserExisted) {
      if (!isUserExisted.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        // send email verification code
        return { error: "Please verify your email." };
      }
      return { error: "Email already exist." };
    }

    // create user
    await db
      .insert(users)
      .values({ name, email, password: hashPassword })
      .returning();

    const verificationToken = await generateEmailVerificationToken(email);

    //  send email verification code
    return { success: "Verification code has been sent to your email." };
  });

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    return { success: { email, password } };
  });
