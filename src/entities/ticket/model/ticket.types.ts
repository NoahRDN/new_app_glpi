export type TicketStatus = "new" | "in_progress" | "resolved";
export type TicketPriority = "medium" | "high" | "critical";

export type Ticket = {
  id: number;
  priority: TicketPriority;
  requester: string;
  status: TicketStatus;
  title: string;
  updatedAt: string;
};
