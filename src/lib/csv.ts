import Papa from "papaparse";
import { z } from "zod";

/** Required by contracts/csv-contract.md; optional columns receive safe defaults. */
export const CSV_HEADERS = [
  "cif",
  "merchant_name",
  "product_type",
  "mid",
  "status",
  "sales_volume_current",
  "tx_count_current",
  "business_address",
  "latitude",
  "longitude",
] as const;

const CsvRowSchema = z.object({
  cif: z.string().min(1, "CIF is required"),
  merchant_name: z.string().min(1, "Merchant name is required"),
  product_type: z.enum(["EDC", "LIVIN_MERCHANT", "BOTH"]),
  mid: z.string().min(1, "MID is required"),
  tid: z.string().optional().default(""),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  sales_volume_current: z.coerce.number().min(0),
  sales_volume_previous: z.coerce.number().min(0).default(0),
  tx_count_current: z.coerce.number().int().min(0).default(0),
  tx_count_previous: z.coerce.number().int().min(0).default(0),
  business_address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  contact_phone: z.string().optional().default(""),
});

export type CsvRow = z.infer<typeof CsvRowSchema>;

export interface RowError {
  row: number;
  errors: string[];
}

export interface ParseResult {
  rows: CsvRow[];
  errors: RowError[];
}

/** Validates header and every row; never mutates on invalid input. */
export function parseMerchantCsv(text: string): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });

  const missing = CSV_HEADERS.filter((h) => !(parsed.meta.fields ?? []).includes(h));
  if (missing.length > 0 || !parsed.meta.fields) {
    return { rows: [], errors: [{ row: 0, errors: [`Missing required header columns: ${missing.join(", ")}`] }] };
  }

  const rows: CsvRow[] = [];
  const errors: RowError[] = [];
  parsed.data.forEach((raw, i) => {
    const result = CsvRowSchema.safeParse(raw);
    if (result.success) rows.push(result.data);
    else
      errors.push({
        row: i + 2, // +2: header row + 1-indexing
        errors: result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`),
      });
  });
  return { rows, errors };
}
