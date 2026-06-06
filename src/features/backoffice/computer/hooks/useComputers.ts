import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getComputers, getComputersPage } from "../../../../entities/computer/api/computer.api";

export const computersQueryKey = ["assets", "computers"] as const;

export function useComputers() {
  return useQuery({
    queryKey: computersQueryKey,
    queryFn: getComputers,
    staleTime: 60_000,
    retry: 1
  });
}

export function useComputersPage(page: number, limit: number) {
  return useQuery({
    queryKey: ["assets", "computers", page, limit],
    queryFn: () => getComputersPage(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
  });
}