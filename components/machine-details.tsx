"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Settings, Clock } from "lucide-react";
import { format } from "date-fns";

interface MachineDetailsProps {
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
  machineid,
  category,
  brand,
  model,
  arrived_date,
  location1,
  location2,
  updated_at,
}: MachineDetailsProps) {
  return (
    <div className="mx-auto p-4 max-w-md">
      <Card className="shadow-lg">
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

          <div className="md:hidden space-y-2">
            {/* <AsyncSelect
              fetcher={searchSpareparts}
              renderOption={(sparePart) => (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="font-medium">{sparePart.model}</div>
                    <div className="text-xs text-muted-foreground">
                      {sparePart.brand}
                    </div>
                  </div>
                </div>
              )}
              getOptionValue={(user) => user.arrived_date}
              getDisplayValue={(user) => (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="font-medium">{user.brand}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.model}
                    </div>
                  </div>
                </div>
              )}
              notFound={
                <div className="py-6 text-center text-sm">No users found</div>
              }
              label="User"
              placeholder="Search users..."
              width="375px"
            /> */}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-4 border-t">
          <Button className="w-full gap-2">
            <Settings className="h-4 w-4" />
            View Machine Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
