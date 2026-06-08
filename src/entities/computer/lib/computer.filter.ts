import type { ComputerFilters } from "../model/computer.types";

export function buildComputerFilter(filters: ComputerFilters): string | undefined {
  const parts: string[] = [];

  const name = filters.name.trim();

  if (name.length > 0) {
    parts.push(`name=ilike=*${name}*`);
  }

  if (filters.dateCreationFrom) {
    parts.push(`date_creation>=${filters.dateCreationFrom}`);
  }

  if (filters.dateCreationTo) {
    parts.push(`date_creation<=${filters.dateCreationTo}`);
  }

  if (filters.statusId !== undefined && filters.statusId !== null) {
    parts.push(`status.id==${filters.statusId}`);
  }

  if (filters.manufacturerId !== undefined && filters.manufacturerId !== null) {
    parts.push(`manufacturer.id==${filters.manufacturerId}`);
  }

  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(";");
}