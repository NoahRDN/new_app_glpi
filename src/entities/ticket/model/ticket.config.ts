import type { CreateTicketPayload, TicketFilters } from "./ticket.types";

export const createTicketDefault : CreateTicketPayload = {
  name: "Ticket New App",
  content: "First Création ticket new app",
  type: 1,
  priority: 10,
};

export const ticketFilterDefault : TicketFilters = {
  name: "",
};
