"use server";

import { db } from "@/server";
import { emailVerificationToken, passwordResetToken } from "@/server/schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

// ---------------------- Email Verify Token ----------------------------

export const checkVerificationTokenExist = async (email: string) => {
  try {
    return await db.query.emailVerificationToken.findFirst({
      where: eq(emailVerificationToken.email, email),
    });
  } catch (error) {
    return null;
  }
};

export const deleteEmailVerificationToken = async (id: string) => {
  await db
    .delete(emailVerificationToken)
    .where(eq(emailVerificationToken.id, id));
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = randomBytes(25).toString("hex");
  const expire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins last

  const isTokenExisted = await checkVerificationTokenExist(email);
  if (isTokenExisted) {
    await deleteEmailVerificationToken(isTokenExisted.id);
  }

  const verificationToken = await db
    .insert(emailVerificationToken)
    .values({ email, token, expire })
    .returning();

  return verificationToken[0];
};

// ---------------------- Password Reset Token ----------------------------

export const checkPasswordResetTokenExist = async (email: string) => {
  try {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
  } catch (error) {
    return null;
  }
};

export const deletePasswordResetToken = async (id: string) => {
  await db.delete(passwordResetToken).where(eq(passwordResetToken.id, id));
};

export const generatePasswordResetToken = async (email: string) => {
  const token = randomBytes(25).toString("hex");
  const expire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins last

  const isTokenExisted = await checkPasswordResetTokenExist(email);
  if (isTokenExisted) {
    await deletePasswordResetToken(isTokenExisted.id);
  }

  const resetToken = await db
    .insert(passwordResetToken)
    .values({ email, token, expire })
    .returning();

  return resetToken[0];
};
