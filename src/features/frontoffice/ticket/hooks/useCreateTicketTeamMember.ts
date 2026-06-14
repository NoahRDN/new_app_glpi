import { useMutation } from "@tanstack/react-query";
import {
  createTicketTeamMember,
} from "../../../../entities/ticket/api/ticketTeam.api";

export function useCreateTicketTeamMember() {
  return useMutation({
    mutationFn: createTicketTeamMember,
    retry: 0,
  });
}
