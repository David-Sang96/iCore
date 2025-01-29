"use server";

import { db } from "@/server";
import { emailVerificationToken } from "@/server/schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

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
