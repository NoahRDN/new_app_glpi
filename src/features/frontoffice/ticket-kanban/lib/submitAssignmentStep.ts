import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import type { CreateTicketTeamMemberPayload } from "../../../../entities/ticket/api/ticketTeam.api";

type PendingStatusChange = {
  ticket: Ticket;
  statusId: number;
  nextModeAfterSuccess?: "resolve" | "review";
};

type SubmitAssignmentStepParams = {
  pendingStatusChange: PendingStatusChange;
  technicianUserId?: number;
  technicianGroupId?: number;

  createTicketTeamMemberAsync: (params: {
    ticketId: number | string;
    payload: CreateTicketTeamMemberPayload;
  }) => Promise<unknown>;

  updateTicketStatusAsync: (params: {
    ticketId: number | string;
    statusId: number;
  }) => Promise<unknown>;
};

export async function submitAssignmentStep({
  pendingStatusChange,
  technicianUserId,
  technicianGroupId,
  createTicketTeamMemberAsync,
  updateTicketStatusAsync,
}: SubmitAssignmentStepParams) {
  if (technicianUserId !== undefined) {
    await createTicketTeamMemberAsync({
      ticketId: pendingStatusChange.ticket.id,
      payload: {
        id: technicianUserId,
        role: "assigned",
        type: "User",
      },
    });
  }

  if (technicianGroupId !== undefined) {
    await createTicketTeamMemberAsync({
      ticketId: pendingStatusChange.ticket.id,
      payload: {
        id: technicianGroupId,
        role: "assigned",
        type: "Group",
      },
    });
  }

  await updateTicketStatusAsync({
    ticketId: pendingStatusChange.ticket.id,
    statusId: pendingStatusChange.statusId,
  });
}