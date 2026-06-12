import { useMutation } from "@tanstack/react-query";
import { createTicketFollowup } from "../../../../entities/ticket/api/ticketFollowup.api";
import type { CreateTicketFollowupPayload, CreateTicketResponse } from "../../../../entities/ticket/model/ticket.types";

export function useCreateTicketFollowup() {
  return useMutation<
    CreateTicketResponse,
    Error,
    {
      payload: CreateTicketFollowupPayload;
      ticketId: number | string;
    }
  >({
    mutationFn: createTicketFollowup,
    retry: 0,
  });
}
