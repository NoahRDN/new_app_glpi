import { useQuery } from "@tanstack/react-query";
import type { TicketFilters } from "../../../../entities/ticket/model/ticket.types";
import { getAllTickets } from "../../../../entities/ticket/api/ticket.api";

export const ticketsQueryKey = ["assistance", "tickets"] as const;

export function useAllTickets(
  filters: TicketFilters,
) {
  return useQuery({
    queryKey: [...ticketsQueryKey, filters],
    queryFn: () => getAllTickets(filters),
    staleTime: 60_000,
    retry: 1,
  });
}