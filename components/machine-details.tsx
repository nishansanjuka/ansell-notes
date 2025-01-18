"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, CheckCheck, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { AsyncSelect } from "./ui/async-select";
import { searchSpareParts, SparePart } from "@/lib/actions";
import { useState } from "react";
import { ServiceForm } from "./service-form";
import { useRouter } from "next/navigation";

interface MachineDetailsProps {
  id: number;
  machineid: string;
  category: string;
  brand: string;
  model: string;
  arrived_date: string;
  location1: string;
  location2: string | null;
  updated_at: Date | null;
}

export function MachineDetails({
  id,
  machineid,
  category,
  brand,
  model,
  arrived_date,
  location1,
  location2,
  updated_at,
}: MachineDetailsProps) {
  const [selectedSparePart, setSelectedSparePart] = useState<string>("");
  const [showServiceForm, setShowServiceForm] = useState(false);

  const { push } = useRouter();

  const handleSparePartQuery = async (query?: string) => {
    const res = await searchSpareParts(query);
    if (res.success) {
      return res.data || [];
    } else {
      return [];
    }
  };

  const handleSparePart = (value: string) => {
    setSelectedSparePart(value);
    handleConfirm();
  };

  const handleConfirm = () => {
    if (selectedSparePart.length > 0) {
      setShowServiceForm(true);
    }
  };

  return (
    <div className="w-full h-screen fixed flex items-center justify-center p-5">
      <Card className="shadow-lg w-full">
        <CardHeader className="space-y-1 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-primary">
              {category}
            </Badge>
            <Badge variant="secondary">ID: {machineid}</Badge>
          </div>
          <h2 className="text-2xl font-bold">{brand}</h2>
          <p className="text-muted-foreground">Model: {model}</p>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Arrived Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(arrived_date), "PP")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {location1} {location2 && `- ${location2}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {updated_at
                    ? format(new Date(updated_at), "PPp")
                    : "Not updated yet"}
                </p>
              </div>
            </div>
          </div>

          <div className=" space-y-2 w-full">
            <AsyncSelect<SparePart>
              triggerClassName="w-full p-1"
              fetcher={handleSparePartQuery}
              renderOption={(sparePart) => (
                <div className="flex items-center gap-3 p-2">
                  <div className="flex-1">
                    <div className="font-medium">{sparePart.sparepart_id}</div>
                    <div className="text-xs text-muted-foreground">
                      {sparePart.brand} - {sparePart.model}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {sparePart.qty} units
                    </div>
                  </div>
                  <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {sparePart.category}
                  </div>
                </div>
              )}
              getOptionValue={(sparePart) => sparePart.id.toString()}
              getDisplayValue={(sparePart) => (
                <div className="flex items-center gap-2 text-left">
                  <div className="flex leading-tight space-x-2 items-center">
                    <div className="font-bold text-xs">
                      {sparePart.sparepart_id}
                    </div>
                    <div className="text-xxs text-muted-foreground">
                      {sparePart.brand} • {sparePart.qty} in stock
                    </div>
                  </div>
                </div>
              )}
              notFound={
                <div className="py-6 text-center text-sm">
                  No spare parts found
                </div>
              }
              label="Spare Part"
              placeholder="Search spare parts..."
              value={selectedSparePart}
              onChange={handleSparePart}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-4 border-t">
          <Button
            disabled={selectedSparePart.length == 0}
            onClick={handleConfirm}
            className="w-full gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Confirm
          </Button>
          <Button
            variant={"outline"}
            onClick={() => push("/")}
            className="w-full gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scan
          </Button>
        </CardFooter>
      </Card>

      <ServiceForm
        open={showServiceForm}
        setOpen={setShowServiceForm}
        machineId={id}
        sparePartId={Number(selectedSparePart)}
      />
    </div>
  );
}
