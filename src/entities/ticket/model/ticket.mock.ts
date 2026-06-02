import type { Ticket } from "./ticket.types";

export const ticketsMock: Ticket[] = [
  {
    id: 1042,
    title: "VPN inaccessible pour l'equipe finance",
    requester: "Miora",
    priority: "critical",
    status: "in_progress",
    updatedAt: "2026-06-02T18:10:00Z",
  },
  {
    id: 1040,
    title: "Remplacement batterie ordinateur portable",
    requester: "Jean",
    priority: "medium",
    status: "new",
    updatedAt: "2026-06-02T15:30:00Z",
  },
  {
    id: 1036,
    title: "Erreur d'impression agence Sud",
    requester: "Soa",
    priority: "high",
    status: "resolved",
    updatedAt: "2026-06-01T09:00:00Z",
  },
];
