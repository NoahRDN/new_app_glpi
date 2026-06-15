// // getTicketCosts

import { useQuery } from "@tanstack/react-query";
import { getTicketCost } from "../../../../entities/ticket-cost/api/ticketCost.api";

export const ticketsQueryKey = ["ticketsCost"] as const;

export function useTicketsCost(id: number) {
  return useQuery({
    queryKey: [ticketsQueryKey, id],
    queryFn: () => getTicketCost(id),
    staleTime: 60_000,
    retry: 1,
  });
}