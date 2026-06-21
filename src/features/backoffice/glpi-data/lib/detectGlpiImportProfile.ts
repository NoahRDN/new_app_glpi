import { normalizeHeader } from "../../../../shared/lib/normalizeHeader";
import type { GlpiImportProfile } from "../model/glpiImportProfile.types";

export function detectMatchingGlpiImportProfiles(
  headers: string[],
  profiles: GlpiImportProfile[],
): GlpiImportProfile[] {
  const normalizedHeaders = new Set(headers.map(normalizeHeader));

  const matchingProfiles = profiles.filter((profile) =>
    profile.requiredHeaders.every((requiredHeader) =>
      normalizedHeaders.has(normalizeHeader(requiredHeader)),
    ),
  );

  matchingProfiles.sort((leftProfile, rightProfile) => {
    return (leftProfile.importOrder ?? 1000) - (rightProfile.importOrder ?? 1000);
  });

  return matchingProfiles;
}
