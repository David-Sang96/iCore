"use server";

import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { loginSchema, registerSchema } from "@/utils/auth-schema-type";
import { generateEmailVerificationToken } from "@/utils/tokens";
import { AuthError } from "next-auth";
import { db } from "..";
import { signIn } from "../auth";
import { users } from "../schema";
import { sendEmail } from "./email-actions";

export const sendEmailWithVerificationToken = async (
  email: string,
  name: string
) => {
  const verificationToken = await generateEmailVerificationToken(email);

  // send email verification code
  await sendEmail(
    verificationToken.email,
    verificationToken.token,
    name.slice(0, 5)
  );
};

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
        await sendEmailWithVerificationToken(email, name);
        return { error: "Please verify your email." };
      }
      return { error: "Email already exist." };
    }

    // create user
    await db
      .insert(users)
      .values({ name, email, password: hashPassword })
      .returning();

    await sendEmailWithVerificationToken(email, name);

    return { success: "Verification code has been sent to your email." };
  });

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existedUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!existedUser) return { error: "Invalid credentials" };

      const isPasswordMatch = await bcrypt.compare(
        password,
        existedUser.password
      );
      if (!isPasswordMatch) return { error: "Invalid credentials" };

      if (!existedUser.emailVerified) {
        await sendEmailWithVerificationToken(
          existedUser.email!,
          existedUser.name!
        );
        return { error: "Please verify your email." };
      }

      await signIn("credentials", { email, password, redirectTo: "/" });
      return { success: "Logged in successfully" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          case "OAuthSignInError":
            return { error: error.message };
        }
      }
      throw error;
    }
  });
