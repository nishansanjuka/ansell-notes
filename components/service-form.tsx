"use client";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { serviceFormSchema, ServiceFormValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { createService } from "@/lib/actions";
import { useRouter } from "next/navigation";

export const ServiceForm: FC<{
  machineId: number;
  sparePartId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ machineId, sparePartId, open, setOpen }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      machineid: undefined,
      sparepartid: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    form.setValue("machineid", machineId);
    form.setValue("sparepartid", sparePartId);
  }, [machineId, sparePartId, form]);

  const { push } = useRouter();

  async function onSubmit(values: ServiceFormValues) {
    try {
      setLoading(true);
      await createService(values);
      toast({
        variant: "default",
        title: "Service created successfully.",
        description: "The service has been created successfully.",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `There was a problem with your request. ${error.message}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Service Form</SheetTitle>
          <SheetDescription>
            Fill in the service details below.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="machineid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Enter machine ID"
                      value={String(field.value)}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sparepartid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spare Part ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter spare part ID"
                      value={String(field.value)}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Add service note"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
