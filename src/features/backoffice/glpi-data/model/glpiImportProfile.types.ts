import type { GlpiDataResourceId } from "./glpiDataResource.config";

export type CsvRawRow = Record<string, string | undefined>;

export type CsvRawFile = {
  fileName: string;
  headers: string[];
  rows: CsvRawRow[];
};

export type GlpiImportMode =
  | "single-resource"
  | "related-resources"
  | "independent-resources";

export type GlpiTransformKey =
  | "none"
  | "trim"
  | "number"
  | "boolean"
  | "date";

export type GlpiFieldMapping = {
  defaultValue?: string;
  header: string;
  required: boolean;
  transform: GlpiTransformKey;
};

export type GlpiResourceMapping = Record<string, GlpiFieldMapping>;

export type GlpiPreviewColumn = {
  field: string;
  label: string;
  resource: GlpiDataResourceId;
};

export type GlpiImportProfile = {
  id: string;
  importOrder?: number;
  label: string;
  mode: GlpiImportMode;
  previewColumns: GlpiPreviewColumn[];
  requiredHeaders: string[];
  resourceMappings: Partial<Record<GlpiDataResourceId, GlpiResourceMapping>>;
};

export type ParsedGlpiProfileRow = Partial<
  Record<GlpiDataResourceId, Record<string, string | number | boolean | undefined>>
>;

export type InvalidGlpiImportRow = {
  parsedRow: ParsedGlpiProfileRow;
  rawRow: CsvRawRow;
  reasons: string[];
  rowIndex: number;
};

export type RecognizedGlpiParsedFile = {
  fileName: string;
  headers: string[];
  invalidRows: InvalidGlpiImportRow[];
  profile: GlpiImportProfile;
  rawRows: CsvRawRow[];
  rows: ParsedGlpiProfileRow[];
  status: "recognized";
};

export type UnknownGlpiParsedFile = {
  fileName: string;
  headers: string[];
  rawRows: CsvRawRow[];
  reason?: string;
  status: "unknown";
};

export type ParsedGlpiImportFile = RecognizedGlpiParsedFile | UnknownGlpiParsedFile;

export type GlpiImageZipEntryPreview = {
  fileName: string;
  reference: string;
};

export type GlpiImageZipEntryUpload = GlpiImageZipEntryPreview & {
  detectedType?: string;
  file: File;
  originalFileName?: string;
  wasRenamed?: boolean;
};

export type ParsedGlpiImagesZipFile = {
  entries: GlpiImageZipEntryPreview[];
  fileName: string;
  status: "image-zip";
};

export type ParsedGlpiImportAsset = ParsedGlpiImportFile | ParsedGlpiImagesZipFile;
