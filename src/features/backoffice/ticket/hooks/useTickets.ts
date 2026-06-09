import { useQuery } from "@tanstack/react-query";
import { getTicket, getTickets } from "../../../../entities/ticket/api/ticket.api";

export const ticketsQueryKey = ["assistance", "tickets"] as const;

export function useTickets() {
  return useQuery({
    queryKey: ticketsQueryKey,
    queryFn: getTickets,
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
