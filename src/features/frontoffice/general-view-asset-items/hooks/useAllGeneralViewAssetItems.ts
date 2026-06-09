import { useQuery } from "@tanstack/react-query";
import { getAllGeneralViewAssetItems } from "../api/generalViewAssetItems.api";
import type { GeneralViewAssetItemsFilters } from "../model/generalViewAssetItems.types";

export const generalViewAssetItemsQueryKey = [
  "assets",
  "AllGeneralViewAssetItems",
] as const;

export function useAllGeneralViewAssetItems(
  filters: GeneralViewAssetItemsFilters,
) {
  return useQuery({
    queryKey: [...generalViewAssetItemsQueryKey, filters],
    queryFn: () => getAllGeneralViewAssetItems(filters),
    staleTime: 60_000,
    retry: 1,
  });
}