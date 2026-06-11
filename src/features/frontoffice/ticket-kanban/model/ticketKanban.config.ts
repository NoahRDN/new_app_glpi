import {
  TICKET_DONE_STATUS_IDS,
  TICKET_IN_PROGRESS_STATUS_IDS,
  TICKET_STATUS_IDS,
} from "../../../../entities/ticket/model/ticket.config";
import type { TicketKanbanGroup } from "./ticketKanban.types";

export const ticketKanbanGroups: TicketKanbanGroup[] = [
  {
    key: "new",
    label: "Nouveau",
    statusIds: [TICKET_STATUS_IDS.NEW],
    canCreateTicket: true,
    targetStatusId: TICKET_STATUS_IDS.NEW,
    backgroundColorSection:"#cdd4f8",
  },
  {
    key: "in_progress",
    label: "In Progress",
    statusIds: [...TICKET_IN_PROGRESS_STATUS_IDS],
    targetStatusId: TICKET_STATUS_IDS.ASSIGNED,
    backgroundColorSection:"#f8cddc",
  },
  {
    key: "done",
    label: "Terminé",
    statusIds: [...TICKET_DONE_STATUS_IDS],
    targetStatusId: TICKET_STATUS_IDS.CLOSED,
    backgroundColorSection:"#cdf8d6",
  },
];
