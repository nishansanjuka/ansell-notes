"use server";

import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

type UserInput = {
  clerk_id: string;
  full_name: string;
};

const isClerkId = (id: string | number): id is string => {
  return typeof id === "string";
};

export async function createOrUpdateUser({ clerk_id, full_name }: UserInput) {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerk_id, clerk_id))
      .limit(1);

    if (existingUser.length > 0) {
      return await db
        .update(users)
        .set({ full_name, updated_at: new Date() })
        .where(eq(users.clerk_id, clerk_id))
        .returning();
    }

    return await db
      .insert(users)
      .values({
        clerk_id,
        full_name,
      })
      .returning();
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    throw error;
  }
}

export async function getUser(identifier: string | number) {
  try {
    const whereClause = isClerkId(identifier)
      ? eq(users.clerk_id, identifier)
      : eq(users.id, identifier);

    const result = await db.select().from(users).where(whereClause).limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error in getUser:", error);
    throw error;
  }
}

export async function updateUser(
  identifier: string | number,
  data: Partial<UserInput>
) {
  try {
    const whereClause = isClerkId(identifier)
      ? eq(users.clerk_id, identifier)
      : eq(users.id, identifier);

    return await db
      .update(users)
      .set({ ...data, updated_at: new Date() })
      .where(whereClause)
      .returning();
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

export async function deleteUser(identifier: string | number) {
  try {
    const whereClause = isClerkId(identifier)
      ? eq(users.clerk_id, identifier)
      : eq(users.id, identifier);

    return await db.delete(users).where(whereClause).returning();
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
}
