import type { GroupFilters } from "../model/group.types";

export function buildGroupFilter(params: { filters?: GroupFilters }) {
  const filters = params.filters;

  if (!filters) {
    return "";
  }

  const name = filters.name?.trim();

  if (name) {
    return `name=ilike=*${name}*`;
  }

  return "";
}
