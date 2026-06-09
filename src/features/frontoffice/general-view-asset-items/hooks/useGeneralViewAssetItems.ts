import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getGeneralViewAssetItemsPage } from "../api/generalViewAssetItems.api";
import type { GeneralViewAssetItemsFilters } from "../model/generalViewAssetItems.types";

export const generalViewAssetItemsQueryKey = [
  "assets",
  "generalViewAssetItems",
] as const;

export function useGeneralViewAssetItemsPage(
  page: number,
  limit: number,
  filters: GeneralViewAssetItemsFilters,
) {
  return useQuery({
    queryKey: [...generalViewAssetItemsQueryKey, page, limit, filters],
    queryFn: () => getGeneralViewAssetItemsPage({page, limit, filters}),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: 1,
  });
}