import { glpiGet, glpiPost } from "../../../shared/api/glpiClient";
import type { CreateTicketPayload, CreateTicketResponse, Ticket } from "../model/ticket.types";

export async function getTickets(): Promise<Ticket[]> {
  return glpiGet<Ticket[]>("/Assistance/Ticket");
}

export async function getTicket(ticketId: number | string): Promise<Ticket> {
  return glpiGet<Ticket>(`/Assistance/Ticket/${ticketId}`);
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<CreateTicketResponse> {
  return glpiPost<CreateTicketResponse>("/Assistance/Ticket", payload);
}
