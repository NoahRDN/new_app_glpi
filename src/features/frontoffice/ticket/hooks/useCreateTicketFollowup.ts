import { useMutation } from "@tanstack/react-query";
import { createTicketFollowup } from "../../../../entities/ticket/api/ticketFollowup.api";

export function useCreateTicketFollowup() {
  return useMutation({
    mutationFn: createTicketFollowup,
    retry: 0,
  });
}
