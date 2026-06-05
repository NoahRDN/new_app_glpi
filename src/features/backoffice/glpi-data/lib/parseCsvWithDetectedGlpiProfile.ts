import { applyGlpiImportProfile } from "./applyGlpiImportProfile";
import { detectGlpiImportProfile } from "./detectGlpiImportProfile";
import { parseCsvRaw } from "./parseCsvRaw";
import type {
  GlpiImportProfile,
  ParsedGlpiImportFile,
} from "../model/glpiImportProfile.types";

function buildUnknownProfileReason(headers: string[]) {
  return [
    "Nom de colonne non conforme a un profil d'import GLPI.",
    `Colonnes detectees: ${headers.join(" ; ") || "<aucune>"}`,
  ].join(" ");
}

export async function parseCsvWithDetectedGlpiProfile(
  file: File,
  profiles: GlpiImportProfile[],
): Promise<ParsedGlpiImportFile> {
  const rawFile = await parseCsvRaw(file);
  const profile = detectGlpiImportProfile(rawFile.headers, profiles);

  if (!profile) {
    return {
      fileName: rawFile.fileName,
      headers: rawFile.headers,
      rawRows: rawFile.rows,
      reason: buildUnknownProfileReason(rawFile.headers),
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
