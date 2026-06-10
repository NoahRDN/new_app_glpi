import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "../../../../entities/ticket/api/ticket.api";
import { ticketsQueryKey } from "../../ticket/hooks/useAllTickets";

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      ticketId: number;
      statusId: number;
    }) => {
        console.log("PATCH ticket status:", params);
        return updateTicket({
            id: params.ticketId,
            status: {
                id: params.statusId,
            },
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketsQueryKey,
      });
    },
  });
}