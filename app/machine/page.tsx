import { MachineDetails } from "@/components/machine-details";
import { getMachineDataByMachineId } from "@/lib/actions";
import { notFound } from "next/navigation";
import React from "react";

export default async function MachinePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const id = (await searchParams).id;
  const data = await getMachineDataByMachineId(id as string);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <MachineDetails
        machineid={data.machineid}
        category={data.category}
        brand={data.brand}
        model={data.model}
        arrived_date={data.arrived_date}
        location1={data.location1}
        location2={data.location2}
        updated_at={data.updated_at}
      />
    </div>
  );
}