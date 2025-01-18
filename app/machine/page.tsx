import { MachineDetails } from "@/components/machine-details";
import { getMachineDataByMachineId } from "@/lib/actions";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
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
      <header className="flex items-center">
        <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b z-50">
          <div className="flex items-center justify-between h-full px-4 overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="logo"
              width={100}
              height={100}
              className="rounded-full"
            />
            <h1 className="text-foreground text-xl font-bold flex-1">Ansell Notes</h1>
            <UserButton />
          </div>
        </div>
      </header>
      <MachineDetails
        id={data.id}
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
