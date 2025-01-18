import { z } from "zod";

export const serviceFormSchema = z.object({
  machineid: z.coerce.number().min(1, "Machine is required"),
  sparepartid: z.coerce.number().min(1, "SparePart is required"),
  notes: z.string({ message: "Notes is required" }).min(1, "Notes is required"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;