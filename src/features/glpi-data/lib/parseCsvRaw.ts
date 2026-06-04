import Papa from "papaparse";
import type { CsvRawFile, CsvRawRow } from "../model/glpiImportProfile.types";

export function parseCsvRaw(file: File): Promise<CsvRawFile> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRawRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (result) => {
        resolve({
          fileName: file.name,
          headers: result.meta.fields ?? [],
          rows: result.data,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
