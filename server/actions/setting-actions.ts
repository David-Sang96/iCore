"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import {
  avatarSchema,
  twoFactorSchema,
  updateProfileNameSchema,
} from "@/utils/schema-types/setting-schema-type";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { users } from "../schema";

export const updateProfileNameAction = actionClient
  .schema(updateProfileNameSchema)
  .action(async ({ parsedInput: { username, email } }) => {
    if (!username)
      return {
        error: "Invalid name",
      };

    const user = await db.query.users.findFirst({
      where: eq(users.email, email!),
    });
    if (!user) return { error: "Invalid credentials" };

    await db
      .update(users)
      .set({ name: username })
      .where(eq(users.email, email!));

    revalidatePath("/dashboard/settings");
    return { success: "Profile name updated successfully" };
  });

export const twoFactorAuthAction = actionClient
  .schema(twoFactorSchema)
  .action(async ({ parsedInput: { isTwoFactorEnable, email } }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) return { error: "Something went wrong" };

    await db
      .update(users)
      .set({ isTwoFactorEnabled: isTwoFactorEnable })
      .where(eq(users.email, email));
    revalidatePath("/dashboard/settings");
    return { success: `2FA setting ${isTwoFactorEnable ? "on" : "off"}` };
  });

export const uploadProfileAvatarAction = actionClient
  .schema(avatarSchema)
  .action(async ({ parsedInput: { image, email } }) => {
    if (!image) {
      return { error: "Image is required" };
    }
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) return { error: "Something went wrong" };
    await db.update(users).set({ image }).where(eq(users.id, user.id));
    revalidatePath("/dashboard/settings");
    return { success: "Profile image updated" };
  });
