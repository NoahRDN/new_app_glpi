import { glpiDelete, glpiGet, glpiPost } from "../../../shared/api/glpiClient";
import type {
  CreateTicketFollowupPayload,
  CreateTicketResponse,
  TicketFollowup,
} from "../model/ticket.types";

export async function getTicketFollowups(ticketId: number | string): Promise<TicketFollowup[]> {
  return glpiGet<TicketFollowup[]>(`/Assistance/Ticket/${ticketId}/Timeline/Followup`);
}

export async function createTicketFollowup(params: {
  payload: CreateTicketFollowupPayload;
  ticketId: number | string;
}): Promise<CreateTicketResponse> {
  return glpiPost<CreateTicketResponse>(
    `/Assistance/Ticket/${params.ticketId}/Timeline/Followup`,
    params.payload,
  );
}

export async function deleteTicketFollowup(
  ticketId: number | string,
  followupId: number | string,
) {
  await glpiDelete(`/Assistance/Ticket/${ticketId}/Timeline/Followup/${followupId}`);
}
