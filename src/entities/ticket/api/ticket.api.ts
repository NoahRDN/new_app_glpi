import { glpiGet } from "../../../shared/api/glpiClient";
import type { Ticket } from "../model/ticket.types";

export async function fetchTickets(): Promise<Ticket[]> {
  return glpiGet<Ticket[]>("/tickets");
}
