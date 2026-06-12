import { useMutation } from "@tanstack/react-query";
import { createTicketSolution } from "../../../../entities/ticket/api/ticketSolution.api";
import type { CreateTicketSolutionPayload, CreateTicketResponse } from "../../../../entities/ticket/model/ticket.types";

export function useCreateTicketSolution() {
  return useMutation<
    CreateTicketResponse,
    Error,
    {
      payload: CreateTicketSolutionPayload;
      ticketId: number | string;
    }
  >({
    mutationFn: createTicketSolution,
    retry: 0,
  });
}
