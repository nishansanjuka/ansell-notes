"use server";

import db from "@/db/drizzle";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "./users";
import { auth } from "@clerk/nextjs/server";

export type ServiceInput = {
  machineid: number;
  sparepartid?: number | null;
  notes?: string | null;
};

export async function createService(data: ServiceInput) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getUser(userId);
    if (!user) throw new Error("User not found");

    return await db
      .insert(services)
      .values({
        ...data,
        employid: user.id,
      })
      .returning();
  } catch (error) {
    console.error("Error in createService:", error);
    throw error;
  }
}

export async function getService(id: number) {
  try {
    const result = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error in getService:", error);
    throw error;
  }
}

export async function updateService(id: number, data: Partial<ServiceInput>) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return await db
      .update(services)
      .set({ ...data, updated_at: new Date() })
      .where(eq(services.id, id))
      .returning();
  } catch (error) {
    console.error("Error in updateService:", error);
    throw error;
  }
}

export async function deleteService(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return await db.delete(services).where(eq(services.id, id)).returning();
  } catch (error) {
    console.error("Error in deleteService:", error);
    throw error;
  }
}

export async function getAllServices() {
  try {
    return await db.select().from(services);
  } catch (error) {
    console.error("Error in getAllServices:", error);
    throw error;
  }
}
