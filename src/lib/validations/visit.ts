import { z } from "zod";

export const CreateVisitSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required"),
  visitorName: z.string().min(1, "Visitor name is required"),
  rootCause: z.enum(["PAPER_OUT", "SIM_SIGNAL_DEAD", "CASHIER_UNTRAINED", "COMPETITOR_PROMO", "STORE_CLOSED", "OTHER"]),
  actionTaken: z.string().min(3, "Action taken summary is required"),
  notes: z.string().optional(),
});

export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;
