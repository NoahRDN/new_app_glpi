import { glpiPost } from "../../../shared/api/glpiClient";
import type {
  CreateTicketFollowupPayload,
  CreateTicketResponse,
} from "../model/ticket.types";

export async function createTicketFollowup(params: {
  payload: CreateTicketFollowupPayload;
  ticketId: number | string;
}): Promise<CreateTicketResponse> {
  return glpiPost<CreateTicketResponse>(
    `/Assistance/Ticket/${params.ticketId}/Timeline/Followup`,
    params.payload,
  );
}
