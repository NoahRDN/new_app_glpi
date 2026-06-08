import { useQuery } from "@tanstack/react-query";
import { getGeneralViewAssetItems } from "../api/generalViewAssetItems.api";

export const generalViewAssetItemsQueryKey = ["assets", "generalViewAssetItems"]

export function useGeneralViewAssetItems(){
    return useQuery({
        queryKey: [...generalViewAssetItemsQueryKey],
        queryFn: getGeneralViewAssetItems,
        staleTime: 60_000,
        retry:1
    })
}