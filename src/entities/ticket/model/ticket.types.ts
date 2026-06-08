export type Ticket = {
  id: number;
  priority: string;
  requester: string;
  status: string;
  name: string;
  updatedAt: string;
};

export type CreateTicket = {
  name: string;
  content: string;
  priority?: number;
  type?: number;
  urgence?: number;
  impact?: number;
}
