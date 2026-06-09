import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { ticketKanbanGroups } from "../model/ticketKanban.config";
import type {
  TicketKanban,
  TicketKanbanGroup,
} from "../model/ticketKanban.types";

export function createEmptyTicketKanban(): TicketKanban {
  return {
    new: [],
    in_progress: [],
    done: [],
  };
}

function getTicketStatusId(ticket: Ticket): number | undefined {
  return ticket.status?.id;
}

export function findTicketKanbanGroup(
  ticket: Ticket,
): TicketKanbanGroup | undefined {
  const statusId = getTicketStatusId(ticket);

  if (statusId === undefined) {
    return undefined;
  }

  return ticketKanbanGroups.find((group) =>
    group.statusIds.includes(statusId),
  );
}

export function groupTicketsByKanban(tickets: Ticket[]): TicketKanban {
  const kanban = createEmptyTicketKanban();

  tickets.forEach((ticket) => {
    const group = findTicketKanbanGroup(ticket);

    if (!group) {
      return;
    }

    kanban[group.key].push(ticket);
  });

  return kanban;
}