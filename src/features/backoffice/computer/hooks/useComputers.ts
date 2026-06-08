import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getComputers,
  getComputersPage,
} from "../../../../entities/computer/api/computer.api";
import type { ComputerFilters } from "../../../../entities/computer/model/computer.types";

export const computersQueryKey = ["assets", "computers"] as const;

export function useComputers() {
  return useQuery({
    queryKey: computersQueryKey,
    queryFn: getComputers,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useComputersPage(page: number, limit: number, search: ComputerFilters) {
  return useQuery({
    queryKey: [...computersQueryKey, page, limit, search],
    queryFn: () => getComputersPage(page, limit, search),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
    select: (computersPage) => ({
      ...computersPage,
      data: computersPage.data.filter((computer) => !computer.is_deleted),
    }),
  });
}