import type { GlpiDataResourceId } from "./glpiDataResource.config";

export type ParsedGlpiImportRow = {
  line: number;
  payload: Record<string, string | number | boolean>;
};

export type ParsedGlpiImportPreview = {
  fileName: string;
  headers: string[];
  resourceId: GlpiDataResourceId;
  rows: ParsedGlpiImportRow[];
};

export type GlpiImportError = {
  line: number;
  message: string;
};

export type GlpiImportResult = {
  errors: GlpiImportError[];
  failedCount: number;
  importedCount: number;
  skippedCount: number;
  totalCount: number;
};
