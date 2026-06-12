import { glpiPost } from "../../../shared/api/glpiClient";

export type CreateTicketTeamMemberPayload = {
  id: number;
  role: "requester" | "assigned" | "observer";
  type: "Group" | "Supplier" | "User";
};

export async function createTicketTeamMember(params: {
  payload: CreateTicketTeamMemberPayload;
  ticketId: number | string;
}): Promise<void> {
  await glpiPost<void>(
    `/Assistance/Ticket/${params.ticketId}/TeamMember`,
    params.payload,
  );
}
