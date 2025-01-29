"use server";

import EmailVerificationTemplate from "@/components/email-templates/email-confirmation";
import { getBaseUrl } from "@/utils/base-url";
import { deleteEmailVerificationToken } from "@/utils/tokens";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "..";
import { emailVerificationToken, users } from "../schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  email: string,
  token: string,
  userFirstname: string
) => {
  const verificationLink = `${getBaseUrl()}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account verification with email - Shopee",
    react: EmailVerificationTemplate({ userFirstname, verificationLink }),
  });

  if (error) console.log(error);
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
