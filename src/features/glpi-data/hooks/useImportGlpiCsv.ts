import { useState } from "react";
import { createGlpiResourceItem } from "../api/glpiDataResource.api";
import { getGlpiDataResource } from "../model/glpiDataResource.config";
import type { ParsedGlpiImportPreview, GlpiImportResult } from "../model/glpiDataImport.types";

export function useImportGlpiCsv() {
  const [error, setError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<GlpiImportResult | null>(null);

  async function importPreview(preview: ParsedGlpiImportPreview) {
    setError("");
    setIsImporting(true);
    setResult(null);

    const resource = getGlpiDataResource(preview.resourceId);
    let importedCount = 0;
    let skippedCount = 0;
    const errors: GlpiImportResult["errors"] = [];

    for (const row of preview.rows) {
      const missingRequiredColumn = resource.requiredColumns.find((column) => {
        const value = row.payload[column];
        return value === undefined || value === "";
      });

      if (missingRequiredColumn) {
        skippedCount += 1;
        errors.push({
          line: row.line,
          message: `Valeur manquante pour ${missingRequiredColumn}.`,
        });
        continue;
      }

      try {
        await createGlpiResourceItem(resource, row.payload);
        importedCount += 1;
      } catch (caughtError) {
        errors.push({
          line: row.line,
          message: caughtError instanceof Error ? caughtError.message : String(caughtError),
        });
      }
    }

    setResult({
      errors,
      failedCount: errors.length,
      importedCount,
      skippedCount,
      totalCount: preview.rows.length,
    });
    setIsImporting(false);
  }

  return {
    error,
    importPreview,
    isImporting,
    result,
  };
}
