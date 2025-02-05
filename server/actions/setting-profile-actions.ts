"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/server";
import { updateProfileNameSchema } from "@/utils/schema-types/setting-schema-type";
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
