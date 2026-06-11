import { useMutation } from "@tanstack/react-query";
import {
  createTicketTeamMember,
  type CreateTicketTeamMemberPayload,
  type CreateTicketTeamMemberResponse,
} from "../../../../entities/ticket/api/ticketTeam.api";

export function useCreateTicketTeamMember() {
  return useMutation<
    CreateTicketTeamMemberResponse,
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
