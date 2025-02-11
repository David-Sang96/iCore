"use server";

import { actionClient } from "@/lib/safe-action";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { AuthError } from "next-auth";

import { db } from "@/server";
import {
  loginSchema,
  passwordResetEmailSchema,
  passwordResetSchema,
  registerSchema,
} from "@/utils/schema-types/auth-schema-type";
import { deleteTwoFACode } from "@/utils/tokens";
import { drizzle } from "drizzle-orm/neon-serverless";
import { signIn } from "../auth";
import { passwordResetToken, twoFactorAuthCode, users } from "../schema";
import {
  sendEmailWithPasswordResetToken,
  sendEmailWithTwoFACode,
  sendEmailWithVerificationToken,
} from "./email-actions";

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
  .action(async ({ parsedInput: { email, password, twoFACode } }) => {
    try {
      const existedUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!existedUser) return { error: "Invalid credentials" };

      const isPasswordMatch = await bcrypt.compare(
        password,
        existedUser.password!
      );
      if (!isPasswordMatch) return { error: "Invalid credentials" };

      if (!existedUser.emailVerified) {
        await sendEmailWithVerificationToken(
          existedUser.email!,
          existedUser.name!
        );
        return { error: "Please verify your email." };
      }

      if (existedUser.isTwoFactorEnabled) {
        if (twoFACode) {
          const existed2FACode = await db.query.twoFactorAuthCode.findFirst({
            where: and(
              eq(twoFactorAuthCode.email, existedUser.email!),
              eq(twoFactorAuthCode.code, twoFACode)
            ),
          });
          if (!existed2FACode)
            return { twoFactorError: "Invalid verifcaiton code" };

          if (new Date() > new Date(existed2FACode.expire))
            return { twoFactorError: "Token expired" };

          await deleteTwoFACode(existed2FACode.id);
        } else {
          await sendEmailWithTwoFACode(existedUser.email!);
          return { twoFactorSuccess: "2FA code has been sent to your mail" };
        }
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

export const SendPasswordResetEmailAction = actionClient
  .schema(passwordResetEmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existedUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existedUser) return { error: "Invalid credentials" };

    await sendEmailWithPasswordResetToken(email, existedUser.name!);
    return { success: "Password reset email has been sent" };
  });

export const PasswordResetAction = actionClient
  .schema(passwordResetSchema)
  .action(async ({ parsedInput: { oldPassword, newPassword, token } }) => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const dbPool = drizzle(pool);
    if (!token) return { error: "Missing Token" };

    const existingToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
    if (!existingToken) return { error: "Invalid Token" };

    if (new Date() > new Date(existingToken.expire))
      return { error: "Expired Token" };

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });
    if (!existingUser) return { error: "Invalid credentials" };

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      existingUser.password!
    );
    if (!isPasswordMatch) return { error: "Invalid credentials" };

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // await deletePasswordResetToken(isTokenValid.id);
    // await db.update(users).set({ password: hashPassword });

    await dbPool.transaction(async (context) => {
      await context
        .update(users)
        .set({ password: hashPassword })
        .where(eq(users.id, existingUser.id));

      await context
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.id, existingToken.id));
    });

    return { success: "Password updated successfully" };
  });
