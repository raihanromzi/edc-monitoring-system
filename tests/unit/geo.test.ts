import { describe, expect, it } from "vitest";
import { haversineMeters } from "@/lib/geo";

describe("haversineMeters", () => {
  it("returns zero for the same coordinate", () => expect(haversineMeters(-6.2297, 106.8082, -6.2297, 106.8082)).toBe(0));
  it("returns approximately 350m for nearby locations", () => expect(haversineMeters(-6.2297, 106.8082, -6.22655, 106.8082)).toBeGreaterThan(300));
});
