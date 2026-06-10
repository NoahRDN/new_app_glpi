import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTicket, getTicketsPage } from "../../../../entities/ticket/api/ticket.api";
import type { TicketFilters } from "../../../../entities/ticket/model/ticket.types";

export const ticketsQueryKey = ["assistance", "tickets"] as const;

export function useTicketsPage(page: number, limit: number, filters: TicketFilters) {
  return useQuery({
    queryKey: [...ticketsQueryKey, page, limit, filters],
    queryFn: () => getTicketsPage(page, limit, filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useTicket(ticketId: number | null) {
  return useQuery({
    queryKey: [...ticketsQueryKey, ticketId],
    queryFn: () => getTicket(ticketId as number),
    enabled: ticketId !== null,
    staleTime: 30_000,
    retry: 1,
  });
}
