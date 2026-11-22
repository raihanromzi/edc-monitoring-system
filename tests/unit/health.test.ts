import { describe, expect, it } from "vitest";
import { calculateHealth } from "@/lib/health";

describe("calculateHealth", () => {
  const thresholds = { redVolumeThreshold: 3_000_000, yellowDropPctThreshold: 0.3 };
  it("prioritizes inactive and zero transactions as RED", () => {
    expect(calculateHealth({ status: "INACTIVE", salesVolumeCurrent: 9_000_000, salesVolumePrevious: 9_000_000, txCountCurrent: 9 }, thresholds)).toBe("RED");
    expect(calculateHealth({ status: "ACTIVE", salesVolumeCurrent: 9_000_000, salesVolumePrevious: 9_000_000, txCountCurrent: 0 }, thresholds)).toBe("RED");
  });
  it("classifies qualifying volume drop as YELLOW", () => {
    expect(calculateHealth({ status: "ACTIVE", salesVolumeCurrent: 5_000_000, salesVolumePrevious: 10_000_000, txCountCurrent: 3 }, thresholds)).toBe("YELLOW");
  });
  it("classifies qualifying stable merchant as GREEN", () => {
    expect(calculateHealth({ status: "ACTIVE", salesVolumeCurrent: 5_000_000, salesVolumePrevious: 6_000_000, txCountCurrent: 3 }, thresholds)).toBe("GREEN");
  });
});
