import { useQuery } from "@tanstack/react-query";
import { getTicketAssetLinks } from "../../../../entities/ticket/api/ticketItem.api";

export const ticketsQueryKey = ["assistance", "ticketAssetLinks"] as const;

export function useTicketAssetLinks() {
  return useQuery({
    queryKey: [ticketsQueryKey],
    queryFn: () => getTicketAssetLinks(),
    staleTime: 60_000,
    retry: 1,
  });
}