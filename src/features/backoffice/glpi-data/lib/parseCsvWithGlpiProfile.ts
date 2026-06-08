import { applyGlpiImportProfile } from "./applyGlpiImportProfile";
import { parseCsvRaw } from "./parseCsvRaw";
import type {
  GlpiImportProfile,
  ParsedGlpiImportFile,
} from "../model/glpiImportProfile.types";

function normalizeHeader(header: string) {
  return header.trim().toLowerCase();
}

function buildMissingHeadersReason(profile: GlpiImportProfile, headers: string[]) {
  const normalizedHeaders = new Set(headers.map(normalizeHeader));
  const missingHeaders = profile.requiredHeaders.filter(
    (requiredHeader) => !normalizedHeaders.has(normalizeHeader(requiredHeader)),
  );

  return [
    `Le fichier ne correspond pas au profil "${profile.label}".`,
    `Colonnes manquantes: ${missingHeaders.join(" ; ") || "<aucune>"}.`,
    `Colonnes detectees: ${headers.join(" ; ") || "<aucune>"}.`,
  ].join(" ");
}

export async function parseCsvWithGlpiProfile(
  file: File,
  profile: GlpiImportProfile,
): Promise<ParsedGlpiImportFile> {
  const rawFile = await parseCsvRaw(file);
  const normalizedHeaders = new Set(rawFile.headers.map(normalizeHeader));
  const matchesProfile = profile.requiredHeaders.every((requiredHeader) =>
    normalizedHeaders.has(normalizeHeader(requiredHeader)),
  );

  if (!matchesProfile) {
    return {
      fileName: rawFile.fileName,
      headers: rawFile.headers,
      rawRows: rawFile.rows,
      reason: buildMissingHeadersReason(profile, rawFile.headers),
      status: "unknown",
    };
  }

  const parsed = applyGlpiImportProfile(rawFile.rows, profile);

  return {
    fileName: rawFile.fileName,
    headers: rawFile.headers,
    invalidRows: parsed.invalidRows,
    profile,
    rawRows: rawFile.rows,
    rows: parsed.rows,
    status: "recognized",
  };
}
