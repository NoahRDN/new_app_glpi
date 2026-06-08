import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../../../../entities/asset/api/asset.api";

export const assetsQueryKey = ["assets"] as const;

export function useAssets() {
  return useQuery({
    queryKey: assetsQueryKey,
    queryFn: getAssets,
    staleTime: 60_000,
  });
}