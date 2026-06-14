// // getTicketCosts

import { useQuery } from "@tanstack/react-query";
import { getTicketCosts } from "../../../../entities/ticket-cost/api/ticketCost.api";

export const ticketsQueryKey = ["ticketsCost"] as const;

export function useAllTicketCosts() {
  return useQuery({
    queryKey: [ticketsQueryKey],
    queryFn: () => getTicketCosts(),
    staleTime: 60_000,
    retry: 1,
  });
}