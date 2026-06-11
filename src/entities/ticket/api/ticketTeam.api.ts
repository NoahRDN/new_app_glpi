import { glpiPost } from "../../../shared/api/glpiClient";

export type CreateTicketTeamMemberPayload = {
  id: number;
  role: "requester" | "assigned" | "observer";
  type: "Group" | "Supplier" | "User";
};

export type CreateTicketTeamMemberResponse = {
  href: string;
  id: number;
};

export async function createTicketTeamMember(params: {
  payload: CreateTicketTeamMemberPayload;
  ticketId: number | string;
}): Promise<CreateTicketTeamMemberResponse> {
  return glpiPost<CreateTicketTeamMemberResponse>(
    `/Assistance/Ticket/${params.ticketId}/TeamMember`,
    params.payload,
  );
}
