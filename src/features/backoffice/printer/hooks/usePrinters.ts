import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getPrinters,
  getPrintersPage,
} from "../../../../entities/printer/api/printer.api";
import type { PrinterFilters } from "../../../../entities/printer/model/printer.types";

export const printersQueryKey = ["assets", "printers"] as const;

export function usePrinters() {
  return useQuery({
    queryKey: printersQueryKey,
    queryFn: getPrinters,
    staleTime: 60_000,
    retry: 1,
  });
}

export function usePrintersPage(page: number, limit: number, filters: PrinterFilters) {
  return useQuery({
    queryKey: [...printersQueryKey, page, limit, filters],
    queryFn: () => getPrintersPage(page, limit, filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
  });
}
