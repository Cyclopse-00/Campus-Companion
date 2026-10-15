import Papa from "papaparse";
import { z } from "zod";

export const MarkerCsvRowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z.string().optional().default(""),
  building: z.string().optional().default(""),
  floor: z.string().optional().default("0"),
});

export type MarkerCsvRow = z.infer<typeof MarkerCsvRowSchema>;

export interface CsvParseResult {
  validRows: MarkerCsvRow[];
  errors: { row: number; message: string }[];
}

/**
 * Parses raw CSV content and validates each row according to the MarkerCsvRowSchema.
 */
export function parseMarkerCsv(csvString: string): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows: MarkerCsvRow[] = [];
        const errors: { row: number; message: string }[] = [];

        results.data.forEach((row, index) => {
          const rowNum = index + 2; // account for 1-based index and header row
          const parsed = MarkerCsvRowSchema.safeParse(row);
          if (parsed.success) {
            validRows.push(parsed.data);
          } else {
            const errorMsgs = parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join(", ");
            errors.push({ row: rowNum, message: errorMsgs });
          }
        });

        resolve({ validRows, errors });
      },
    });
  });
}
