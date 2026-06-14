// // getTicketCosts

import { useQuery } from "@tanstack/react-query";
import { getTicketCostByIds } from "../../../../entities/ticket-cost/api/ticketCost.api";

export const ticketsQueryKey = ["ticketsCost"] as const;

export function useTicketsCostByIds(ids: number[]) {
  return useQuery({
    queryKey: [ticketsQueryKey, ids],
    queryFn: () => getTicketCostByIds(ids),
    staleTime: 60_000,
    retry: 1,
  });
}