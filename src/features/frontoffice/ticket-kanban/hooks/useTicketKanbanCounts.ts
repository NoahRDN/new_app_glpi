import { useQuery } from "@tanstack/react-query";
import { getTicketKanbanCounts } from "../api/ticketKanban.api";

export const ticketKanbanCountsQueryKey = ["tickets", "kanban", "counts"] as const;

export function useTicketKanbanCounts() {
  return useQuery({
    queryKey: ticketKanbanCountsQueryKey,
    queryFn: getTicketKanbanCounts,
    staleTime: 30_000,
    retry: 1,
  });
}