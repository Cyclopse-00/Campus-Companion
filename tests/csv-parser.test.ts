import { describe, it, expect } from "vitest";
import { parseMarkerCsv } from "@/lib/csv-parser";

describe("CSV Parser utility", () => {
  it("successfully parses and validates correct marker CSV content", async () => {
    const csvData = `name,category,latitude,longitude,description,building,floor
Cafeteria,food,17.4065,78.4772,Central canteen,Block A,1
Library,study,17.4070,78.4780,Central Library,Block B,2`;

    const result = await parseMarkerCsv(csvData);
    expect(result.errors).toHaveLength(0);
    expect(result.validRows).toHaveLength(2);
    expect(result.validRows[0].name).toBe("Cafeteria");
    expect(result.validRows[0].latitude).toBe(17.4065);
    expect(result.validRows[0].longitude).toBe(78.4772);
  });

  it("identifies row errors when coordinates are invalid", async () => {
    const csvData = `name,category,latitude,longitude,description,building,floor
Invalid Marker,food,999.0,78.4772,Out of bounds,Block A,1`;

    const result = await parseMarkerCsv(csvData);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.validRows).toHaveLength(0);
  });
});
