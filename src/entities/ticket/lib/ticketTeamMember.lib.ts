import type { Ticket } from "../model/ticket.types";

export function hasAssignedTechnicianOrGroup(ticket: Ticket) {
  return (ticket.team ?? []).some((teamMember) => {
    const normalizedRole = teamMember.role.trim().toLowerCase();
    const normalizedType = teamMember.type.trim().toLowerCase();

    return (
      normalizedRole === "assigned" &&
      (normalizedType === "user" || normalizedType === "group")
    );
  });
}