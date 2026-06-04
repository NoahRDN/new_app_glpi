import type {
  CsvRawRow,
  GlpiFieldMapping,
  GlpiTransformKey,
  InvalidGlpiImportRow,
  ParsedGlpiProfileRow,
  GlpiImportProfile,
} from "../model/glpiImportProfile.types";

function getValueToTransform(rawValue: string | undefined, mapping: GlpiFieldMapping) {
  const normalizedRawValue = rawValue?.trim() ?? "";

  if (normalizedRawValue.length > 0) {
    return rawValue;
  }

  if (mapping.defaultValue !== undefined) {
    return mapping.defaultValue;
  }

  if (!mapping.required) {
    return undefined;
  }

  return "";
}

function applyTransform(value: string | undefined, transform: GlpiTransformKey) {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  switch (transform) {
    case "trim":
      return trimmedValue;

    case "number":
      return Number(trimmedValue.replace(",", "."));

    case "boolean":
      return ["1", "true", "yes", "oui"].includes(trimmedValue.toLowerCase());

    case "date": {
      const match = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!match) {
        return trimmedValue;
      }

      return `${match[3]}-${match[2]}-${match[1]}`;
    }

    case "none":
    default:
      return value;
  }
}

function validateMappedValue(
  fieldName: string,
  value: string | number | boolean | undefined,
  mapping: GlpiFieldMapping,
) {
  if (mapping.required && (value === undefined || value === "")) {
    return `${fieldName} manquant`;
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return `${fieldName} invalide`;
  }

  return null;
}

export function applyGlpiImportProfile(
  rawRows: CsvRawRow[],
  profile: GlpiImportProfile,
): {
  invalidRows: InvalidGlpiImportRow[];
  rows: ParsedGlpiProfileRow[];
} {
  const rows: ParsedGlpiProfileRow[] = [];
  const invalidRows: InvalidGlpiImportRow[] = [];

  rawRows.forEach((rawRow, rowIndex) => {
    const parsedRow: ParsedGlpiProfileRow = {};
    const reasons: string[] = [];

    Object.entries(profile.resourceMappings).forEach(([resource, fieldMappings]) => {
      if (!fieldMappings) {
        return;
      }

      const parsedResource: Record<string, string | number | boolean | undefined> = {};

      Object.entries(fieldMappings).forEach(([field, mapping]) => {
        const rawValue = rawRow[mapping.header];
        const valueToTransform = getValueToTransform(rawValue, mapping);
        const transformedValue = applyTransform(valueToTransform, mapping.transform);

        parsedResource[field] = transformedValue;

        const validationError = validateMappedValue(
          `${resource}.${field}`,
          transformedValue,
          mapping,
        );

        if (validationError) {
          reasons.push(validationError);
        }
      });

      Object.assign(parsedRow, {
        [resource]: parsedResource,
      });
    });

    if (reasons.length > 0) {
      invalidRows.push({
        parsedRow,
        rawRow,
        reasons,
        rowIndex,
      });
      return;
    }

    rows.push(parsedRow);
  });

  return {
    invalidRows,
    rows,
  };
}
