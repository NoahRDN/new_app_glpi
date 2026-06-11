export function normalizeKey(value: string | number | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}