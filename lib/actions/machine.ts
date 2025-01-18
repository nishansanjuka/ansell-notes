"use server";

import db from "@/db/drizzle";
import { machines, spareparts } from "@/db/schema";
import { eq, like } from "drizzle-orm";

export async function getMachineDataByMachineId(id: string) {
  const data = await db
    .select()
    .from(machines)
    .where(eq(machines.machineid, id))
    .limit(1);

  if (data[0]) {
    return data[0];
  } else return undefined;
}

export async function searchSpareparts(sparepartId: string) {
  const results = await db
    .select()
    .from(spareparts)
    .where(like(spareparts.sparepart_id, `%${sparepartId}%`))
    .limit(10)
    .orderBy(spareparts.id);

  return results;
}
