import type { TicketKanbanGroup } from "./ticketKanban.types";

export const ticketKanbanGroups: TicketKanbanGroup[] = [
  {
    key: "new",
    label: "Nouveau",
    statusIds: [1],
    canCreateTicket: true,
    targetStatusId: 1,
    backgroundColorSection:"#cdd4f8",
  },
  {
    key: "in_progress",
    label: "In Progress",
    statusIds: [2, 3, 4],
    targetStatusId: 2,
    backgroundColorSection:"#f8cddc",
  },
  {
    key: "done",
    label: "Terminé",
    statusIds: [5, 6],
    targetStatusId: 5,
    backgroundColorSection:"#cdf8d6",
  },
];