import { glpiGet, glpiPost } from "../../../shared/api/glpiClient";
import type { CreateTicket, Ticket } from "../model/ticket.types";

export async function getTickets(): Promise<Ticket[]> {
  return glpiGet<Ticket[]>("/Assistance/Ticket");
}

export async function createTicket(createTicketPayload: CreateTicket) {
  return glpiPost<CreateTicket>("/Assistance/Ticket", createTicketPayload);
}