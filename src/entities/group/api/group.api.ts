import { glpiGetPaginated } from "../../../shared/api/glpiClient";
import { buildGroupFilter } from "../lib/group.filter";
import type { Group, GroupFilters } from "../model/group.types";

export async function getGroupsPage(params: {
  filters?: GroupFilters;
  limit: number;
  page: number;
}) {
  const start = params.page * params.limit;
  const searchParams = new URLSearchParams({
    start: String(start),
    limit: String(params.limit),
  });

  const filter = buildGroupFilter({
    filters: params.filters,
  });

  if (filter) {
    searchParams.set("filter", filter);
  }

  return glpiGetPaginated<Group>(`/Administration/Group?${searchParams.toString()}`);
}

export async function getGroups(params?: { filters?: GroupFilters }): Promise<Group[]> {
  const firstPage = await getGroupsPage({
    filters: params?.filters,
    page: 0,
    limit: 100,
  });

  const totalPages = Math.ceil(firstPage.total / 100);
  const allItems = [...firstPage.data];

  for (let page = 1; page < totalPages; page += 1) {
    const nextPage = await getGroupsPage({
      filters: params?.filters,
      page,
      limit: 100,
    });

    allItems.push(...nextPage.data);
  }

  return allItems;
}
