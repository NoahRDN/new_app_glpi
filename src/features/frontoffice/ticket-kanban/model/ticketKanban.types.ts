import type { Ticket } from "../../../../entities/ticket/model/ticket.types";

export type TicketKanbanGroupKey =
  | "new"
  | "in_progress"
  | "done";

export type TicketKanbanGroup = {
  key: TicketKanbanGroupKey;
  label: string;
  statusIds: number[];
  targetStatusId: number;
  canCreateTicket?: boolean;
  backgroundColorSection: string;
};

export type TicketKanban = Record<TicketKanbanGroupKey, Ticket[]>;
