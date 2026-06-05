import type { GlpiImportProfile } from "../model/glpiImportProfile.types";

function normalizeHeader(header: string) {
  return header.trim().toLowerCase();
}

export function detectGlpiImportProfile(
  headers: string[],
  profiles: GlpiImportProfile[],
): GlpiImportProfile | null {
  const normalizedHeaders = new Set(headers.map(normalizeHeader));

  const matchingProfiles = profiles.filter((profile) =>
    profile.requiredHeaders.every((requiredHeader) =>
      normalizedHeaders.has(normalizeHeader(requiredHeader)),
    ),
  );

  matchingProfiles.sort((leftProfile, rightProfile) => {
    const requiredHeadersDifference =
      rightProfile.requiredHeaders.length - leftProfile.requiredHeaders.length;

    if (requiredHeadersDifference !== 0) {
      return requiredHeadersDifference;
    }

    return (leftProfile.importOrder ?? 1000) - (rightProfile.importOrder ?? 1000);
  });

  return matchingProfiles[0] ?? null;
}
