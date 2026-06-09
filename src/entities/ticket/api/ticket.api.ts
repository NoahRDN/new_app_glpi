import { glpiGet, glpiGetPaginated, glpiPatch, glpiPost, type PaginatedResult } from "../../../shared/api/glpiClient";
import { buildTicketFilter } from "../lib/ticket.filter";
import type { CreateTicketPayload, CreateTicketResponse, Ticket, TicketFilters } from "../model/ticket.types";

export type UpdateTicketPayload = Partial<CreateTicketPayload> & {
  id: number;
};

export async function getTicketsPage(
  page: number,
  limit: number,
  filters: TicketFilters,
) : Promise<PaginatedResult<Ticket>> {
  const start = page * limit;
  
  const params = new URLSearchParams({
    start: String(start),
    limit: String(limit),
  });

  const filter = buildTicketFilter({ filters });

  if (filter) {
    params.set("filter", filter);
  }

  return glpiGetPaginated<Ticket>(`/Assistance/Ticket?${params.toString()}`);
}

export async function getTicket(ticketId: number | string): Promise<Ticket> {
  return glpiGet<Ticket>(`/Assistance/Ticket/${ticketId}`);
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<CreateTicketResponse> {
  return glpiPost<CreateTicketResponse>("/Assistance/Ticket", payload);
}

export async function updateTicket(
  payload: UpdateTicketPayload,
): Promise<Ticket> {
  const { id, ...body } = payload;
  return glpiPatch<Ticket>(`/Assistance/Ticket/${id}`, body);
}
