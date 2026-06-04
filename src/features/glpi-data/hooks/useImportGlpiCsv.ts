import { useState } from "react";
import { createGlpiResourceItem } from "../api/glpiDataResource.api";
import { extractGlpiImageFilesFromZip } from "../lib/parseGlpiImagesZip";
import { getGlpiDataResource, type GlpiDataResourceId } from "../model/glpiDataResource.config";
import type {
  ParsedGlpiImagesZipFile,
  RecognizedGlpiParsedFile,
} from "../model/glpiImportProfile.types";

type ImportFilesInput = {
  imageZipFiles?: File[];
  importImages: boolean;
  recognizedFiles: RecognizedGlpiParsedFile[];
};

type ImportError = {
  fileName: string;
  message: string;
};

type ImportResult = {
  errors: ImportError[];
  failedCount: number;
  importedCount: number;
  skippedCount: number;
};

function getResourcePayloads(file: RecognizedGlpiParsedFile) {
  return file.rows.flatMap((row) =>
    Object.entries(file.profile.resourceMappings).flatMap(([resourceId]) => {
      const payload = row[resourceId as GlpiDataResourceId];

      if (!payload) {
        return [];
      }

      return [{
        payload: Object.fromEntries(
          Object.entries(payload).filter(([, value]) => value !== undefined),
        ) as Record<string, string | number | boolean>,
        resourceId: resourceId as GlpiDataResourceId,
      }];
    }),
  );
}

export function useImportGlpiCsv() {
  const [error, setError] = useState<unknown>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function importFiles({ imageZipFiles = [], importImages, recognizedFiles }: ImportFilesInput) {
    setError(null);
    setIsImporting(true);
    setResult(null);

    let importedCount = 0;
    let skippedCount = 0;
    const errors: ImportError[] = [];

    for (const file of recognizedFiles) {
      for (const item of getResourcePayloads(file)) {
        try {
          await createGlpiResourceItem(getGlpiDataResource(item.resourceId), item.payload);
          importedCount += 1;
        } catch (caughtError) {
          errors.push({
            fileName: file.fileName,
            message: caughtError instanceof Error ? caughtError.message : String(caughtError),
          });
        }
      }

      skippedCount += file.invalidRows.length;
    }

    if (importImages) {
      for (const imageZipFile of imageZipFiles) {
        try {
          const imageEntries = await extractGlpiImageFilesFromZip(imageZipFile);
          const documentResource = getGlpiDataResource("documents");

          for (const imageEntry of imageEntries) {
            await createGlpiResourceItem(documentResource, {
              comment: `Import image zip: ${imageZipFile.name}`,
              filename: imageEntry.fileName,
              name: imageEntry.reference || imageEntry.fileName,
            });
            importedCount += 1;
          }
        } catch (caughtError) {
          errors.push({
            fileName: imageZipFile.name,
            message: caughtError instanceof Error ? caughtError.message : String(caughtError),
          });
        }
      }
    } else {
      skippedCount += imageZipFiles.length;
    }

    setResult({
      errors,
      failedCount: errors.length,
      importedCount,
      skippedCount,
    });
    setIsImporting(false);
  }

  return {
    error,
    importFiles,
    isImporting,
    result,
  };
}

export type { ParsedGlpiImagesZipFile };
