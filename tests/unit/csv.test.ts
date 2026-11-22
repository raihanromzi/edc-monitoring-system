import { describe, expect, it } from "vitest";
import { parseMerchantCsv } from "@/lib/csv";

const header = "cif,merchant_name,product_type,mid,tid,status,sales_volume_current,sales_volume_previous,tx_count_current,tx_count_previous,business_address,latitude,longitude,contact_phone";
const valid = "10982341,Synthetic Cafe,EDC,MID001,TID001,ACTIVE,4000000,5000000,10,12,Jakarta,-6.2,106.8,08123";

describe("parseMerchantCsv", () => {
  it("accepts a contract-compliant row", () => {
    const result = parseMerchantCsv(`${header}\n${valid}`);
    expect(result.errors).toEqual([]);
    expect(result.rows[0]?.mid).toBe("MID001");
  });

  it("reports missing headers before mutation", () => {
    const result = parseMerchantCsv("cif,mid\n109,MID001");
    expect(result.rows).toEqual([]);
    expect(result.errors[0]?.row).toBe(0);
    expect(result.errors[0]?.errors[0]).toContain("merchant_name");
  });

  it("accepts optional tid and phone columns as extra headers", () => {
    const result = parseMerchantCsv(`${header}\n${valid}`);
    expect(result.errors).toEqual([]);
    expect(result.rows[0]?.tid).toBe("TID001");
    expect(result.rows[0]?.contact_phone).toBe("08123");
  });

  it("returns row-specific validation errors", () => {
    const result = parseMerchantCsv(`${header}\n${valid.replace("-6.2", "900")}`);
    expect(result.rows).toEqual([]);
    expect(result.errors[0]?.row).toBe(2);
    expect(result.errors[0]?.errors.join()).toContain("latitude");
  });
});
