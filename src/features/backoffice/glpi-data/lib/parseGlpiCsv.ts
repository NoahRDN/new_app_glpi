import type { ParsedGlpiImportPreview } from "../model/glpiDataImport.types";
import type { GlpiDataResourceConfig } from "../model/glpiDataResource.config";

function detectDelimiter(headerLine: string) {
  return headerLine.includes(";") ? ";" : ",";
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function parseLine(line: string, delimiter: string) {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === "\"") {
      if (inQuotes && line[index + 1] === "\"") {
        currentValue += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === delimiter && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());

  return values.map((value) => value.replace(/^"(.*)"$/, "$1").trim());
}

function parseCellValue(value: string) {
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (value.toLowerCase() === "true") {
    return true;
  }

  if (value.toLowerCase() === "false") {
    return false;
  }

  return value;
}

export async function parseGlpiCsv(
  file: File,
  resource: GlpiDataResourceConfig,
): Promise<ParsedGlpiImportPreview> {
  const content = await file.text();
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");

  if (lines.length < 2) {
    throw new Error("Le CSV doit contenir un en-tete et au moins une ligne de donnees.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const rawHeaders = parseLine(lines[0], delimiter);
  const normalizedHeaders = rawHeaders.map(normalizeHeader);
  const missingColumns = resource.requiredColumns.filter(
    (column) => !normalizedHeaders.includes(normalizeHeader(column)),
  );

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes obligatoires manquantes: ${missingColumns.join(", ")}.`);
  }

  const rows = lines.slice(1).map((line, rowIndex) => {
    const values = parseLine(line, delimiter);
    const payload = rawHeaders.reduce<Record<string, string | number | boolean>>((accumulator, rawHeader, index) => {
      const key = rawHeader.trim();
      const value = values[index]?.trim() ?? "";

      if (key !== "" && value !== "") {
        accumulator[key] = parseCellValue(value);
      }

      return accumulator;
    }, {});

    return {
      line: rowIndex + 2,
      payload,
    };
  });

  return {
    fileName: file.name,
    headers: rawHeaders,
    resourceId: resource.id,
    rows,
  };
}
