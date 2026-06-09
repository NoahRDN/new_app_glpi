export type Ticket = {
  id: number;
  priority: string;
  requester: string;
  status: string;
  name: string;
  updatedAt: string;
};

export type CreateTicketPayload = {
  name: string;
  content: string;
  type: number;
  urgency?: number;
  impact?: number;
  priority?: number;
};

export type CreateTicketResponse = {
  id: number;
  href: string;
};