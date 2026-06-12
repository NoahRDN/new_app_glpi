import { useMutation } from "@tanstack/react-query";
import { updateTicketSolution } from "../../../../entities/ticket/api/ticketSolution.api";
import type { TicketSolution, UpdateTicketSolutionPayload } from "../../../../entities/ticket/model/ticket.types";

export function useUpdateTicketSolution() {
  return useMutation<TicketSolution, Error, UpdateTicketSolutionPayload>({
    mutationFn: updateTicketSolution,
    retry: 0,
  });
}
