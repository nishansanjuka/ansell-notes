"use server";

import { eq, like, desc, asc, lte, or } from "drizzle-orm";
import { spareparts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";

// Types
export type SparePart = typeof spareparts.$inferSelect;
export type NewSparePart = typeof spareparts.$inferInsert;
export type SparePartResponse<T = SparePart> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Create
export async function createSparePart(
  data: NewSparePart
): Promise<SparePartResponse> {
  try {
    const [newPart] = await db.insert(spareparts).values(data).returning();
    revalidatePath("/spareparts");
    return { success: true, data: newPart };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to create spare part: ${errorMessage}`,
    };
  }
}

// Read
export async function getSparePart(id: number): Promise<SparePartResponse> {
  try {
    const [part] = await db
      .select()
      .from(spareparts)
      .where(eq(spareparts.id, id));
    if (!part) return { success: false, error: "Spare part not found" };
    return { success: true, data: part };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to fetch spare part: ${errorMessage}`,
    };
  }
}

// Update
export async function updateSparePart(
  id: number,
  data: Partial<NewSparePart>
): Promise<SparePartResponse> {
  try {
    const [updated] = await db
      .update(spareparts)
      .set({ ...data, updated_at: new Date() })
      .where(eq(spareparts.id, id))
      .returning();
    revalidatePath("/spareparts");
    return { success: true, data: updated };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to update spare part: ${errorMessage}`,
    };
  }
}

// Delete
export async function deleteSparePart(
  id: number
): Promise<SparePartResponse<void>> {
  try {
    await db.delete(spareparts).where(eq(spareparts.id, id));
    revalidatePath("/spareparts");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to delete spare part: ${errorMessage}`,
    };
  }
}

// Search functionality
export async function searchSpareParts(
  query?: string
): Promise<SparePartResponse<SparePart[]>> {
  console.log(query);
  try {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

    const parts = await db
      .select()
      .from(spareparts)
      .where(
        query
          ? or(
              like(spareparts.sparepart_id, `%${query.toLocaleUpperCase()}%`),
              like(spareparts.model, `%${query}%`)
            )
          : undefined
      )
      .limit(10);

    return { success: true, data: parts };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to search spare parts: ${errorMessage}`,
    };
  }
}

// Get all spare parts with pagination
export async function getAllSpareParts(
  page = 1,
  limit = 20
): Promise<SparePartResponse<SparePart[]>> {
  try {
    const offset = (page - 1) * limit;
    const parts = await db
      .select()
      .from(spareparts)
      .orderBy(desc(spareparts.created_at))
      .limit(limit)
      .offset(offset);

    return { success: true, data: parts };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to fetch spare parts: ${errorMessage}`,
    };
  }
}

// Get low stock spare parts (qty <= 5)
export async function getLowStockSpareParts(): Promise<
  SparePartResponse<SparePart[]>
> {
  try {
    const parts = await db
      .select()
      .from(spareparts)
      .where(lte(spareparts.qty, 5))
      .orderBy(asc(spareparts.qty));

    return { success: true, data: parts };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to fetch low stock parts: ${errorMessage}`,
    };
  }
}
