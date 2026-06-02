export function formatRelativeDate(isoDate: string) {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
