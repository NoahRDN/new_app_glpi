import type { TicketKanbanGroup } from "./ticketKanban.types";

export const ticketKanbanGroups: TicketKanbanGroup[] = [
  {
    key: "new",
    label: "Nouveau",
    statusIds: [1],
    canCreateTicket: true,
  },
  {
    key: "in_progress",
    label: "In Progress",
    statusIds: [2, 3, 4],
  },
  {
    key: "done",
    label: "Terminé",
    statusIds: [5, 6],
  },
];