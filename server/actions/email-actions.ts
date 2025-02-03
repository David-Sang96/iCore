"use server";

import EmailVerificationTemplate from "@/components/email-templates/email-confirmation";
import ResetPasswordTemplate from "@/components/email-templates/password-reset";
import { getBaseUrl } from "@/utils/base-url";
import {
  deleteEmailVerificationToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
} from "@/utils/tokens";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "..";
import { emailVerificationToken, users } from "../schema";

const resend = new Resend(process.env.RESEND_API_KEY);

// --------- Email verification ----------

export const sendVerificationEmail = async (
  email: string,
  token: string,
  userFirstname: string
) => {
  const verificationLink = `${getBaseUrl()}/auth/verify-email?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account verification with email - Shopee",
    react: EmailVerificationTemplate({ userFirstname, verificationLink }),
  });
  if (error) console.log(error);
};

export const sendEmailWithVerificationToken = async (
  email: string,
  name: string
) => {
  const verificationToken = await generateEmailVerificationToken(email);

  if (!verificationToken)
    return { error: "Failed to generate email verification token" };

  // send email verification code
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
    name.slice(0, 5)
  );
};

export const verifyEmail = async (token: string) => {
  const isTokenExisted = await db.query.emailVerificationToken.findFirst({
    where: eq(emailVerificationToken.token, token),
  });
  if (!isTokenExisted) return { error: "Invalid token" };

  const isExpired = new Date() > new Date(isTokenExisted.expire);
  if (isExpired) return { error: "Expired token" };

  const isUserExisted = await db.query.users.findFirst({
    where: eq(users.email, isTokenExisted.email),
  });
  if (!isUserExisted) return { error: "Please create an account." };

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: isUserExisted.email })
    .where(eq(users.id, isUserExisted.id));

  await deleteEmailVerificationToken(isTokenExisted.id);

  return { success: "Email verified successfully." };
};

// --------- Reset Password ----------

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string
) => {
  const resetLink = `${getBaseUrl()}/auth/reset-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password for your Shopee account",
    react: ResetPasswordTemplate({ username, resetLink }),
  });
  if (error) console.log(error);
};

export const sendEmailWithPasswordResetToken = async (
  email: string,
  name: string
) => {
  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken)
    return { error: "Failed to generate password reset token" };

  // send email password reset code
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
    name
  );
};
