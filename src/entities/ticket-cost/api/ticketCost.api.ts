import {
  glpiLegacyDelete,
  glpiLegacyGet,
  glpiLegacyPost,
  glpiLegacyPut,
} from "../../../shared/api/glpiLegacyClient";

export type TicketCost = {
  [key: string]: unknown;
  id: number;
  cost_time: string;
  cost_fixed: string;
  actiontime: number;
};

export type CreateTicketCost = Record<string, unknown>;

export type UpdateTicketCost = Record<string, unknown> & {
  id: number;
};

export async function getTicketCosts(): Promise<TicketCost[]> {
  return glpiLegacyGet<TicketCost[]>("/TicketCost");
}

export async function getTicketCost(ticketCostId: number | string): Promise<TicketCost> {
  return glpiLegacyGet<TicketCost>(`/TicketCost/${ticketCostId}`);
}

export async function createTicketCost(payload: CreateTicketCost): Promise<TicketCost> {
  return glpiLegacyPost<TicketCost>("/TicketCost", payload);
}

export async function updateTicketCost(payload: UpdateTicketCost): Promise<TicketCost> {
  const { id, ...body } = payload;
  return glpiLegacyPut<TicketCost>(`/TicketCost/${id}`, body);
}

export async function deleteTicketCost(ticketCostId: number | string) {
  await glpiLegacyDelete(`/TicketCost/${ticketCostId}`);
}
