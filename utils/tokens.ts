"use server";

import { db } from "@/server";
import {
  emailVerificationToken,
  passwordResetToken,
  twoFactorAuthCode,
} from "@/server/schema";
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
  //generates a random 50-character (25-byte) hexadecimal string
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
  //generates a random 50-character (25-byte) hexadecimal string
  const token = randomBytes(25).toString("hex");
  const expire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins last

  const isTokenExisted = await checkPasswordResetTokenExist(email);
  if (isTokenExisted) await deletePasswordResetToken(isTokenExisted.id);

  const resetToken = await db
    .insert(passwordResetToken)
    .values({ email, token, expire })
    .returning();

  return resetToken[0];
};

// ---------------------- Two Factor Authentication Token ----------------------------

export const checkTwoFACodeExist = async (email: string) => {
  try {
    return await db.query.twoFactorAuthCode.findFirst({
      where: eq(twoFactorAuthCode.email, email),
    });
  } catch (error) {
    return null;
  }
};

export const deleteTwoFACode = (id: string) => {
  return db.delete(twoFactorAuthCode).where(eq(twoFactorAuthCode.id, id));
};

export const generateTwoFactorCode = async (email: string) => {
  try {
    //generate a 6-Digit Random Number String
    const code = (
      (parseInt(randomBytes(3).toString("hex"), 16) % 900000) +
      100000
    ).toString();
    const expire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins last
    const isTwoFACodeExisted = await checkTwoFACodeExist(email);
    if (isTwoFACodeExisted) await deleteTwoFACode(isTwoFACodeExisted.id);

    const twoFACode = await db
      .insert(twoFactorAuthCode)
      .values({ code, email, expire })
      .returning();

    return twoFACode[0];
  } catch (error) {
    return null;
  }
};
