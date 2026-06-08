import type { CreateTicket } from "./ticket.types";

export const createTicketDefault : CreateTicket = {
  name: "",
  content: "",
  priority: -1,
  type: -1,
  urgence: -1,
  impact: -1,
};
