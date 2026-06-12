import { useMutation } from "@tanstack/react-query";
import {
  createTicketTeamMember,
  type CreateTicketTeamMemberPayload,
} from "../../../../entities/ticket/api/ticketTeam.api";

export function useCreateTicketTeamMember() {
  return useMutation<
    void,
    Error,
    {
      payload: CreateTicketTeamMemberPayload;
      ticketId: number | string;
    }
  >({
    mutationFn: createTicketTeamMember,
    retry: 0,
  });
}
