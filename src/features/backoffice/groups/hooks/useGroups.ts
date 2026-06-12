import { useQuery } from "@tanstack/react-query";
import { getGroups } from "../../../../entities/group/api/group.api";
import type { GroupFilters } from "../../../../entities/group/model/group.types";

export const groupsQueryKey = ["administration", "groups"] as const;

export function useGroups(filters?: GroupFilters) {
  return useQuery({
    queryKey: [...groupsQueryKey, filters] as const,
    queryFn: () => getGroups({ filters }),
  });
}
