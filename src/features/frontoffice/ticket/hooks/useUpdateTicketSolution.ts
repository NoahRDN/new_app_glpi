import { useMutation } from "@tanstack/react-query";
import { updateTicketSolution } from "../../../../entities/ticket/api/ticketSolution.api";

export function useUpdateTicketSolution() {
  return useMutation({
    mutationFn: updateTicketSolution,
    retry: 0,
  });
}
