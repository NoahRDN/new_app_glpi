import { useMutation } from "@tanstack/react-query";
import { createTicketSolution } from "../../../../entities/ticket/api/ticketSolution.api";

export function useCreateTicketSolution() {
  return useMutation({
    mutationFn: createTicketSolution,
    retry: 0,
  });
}
