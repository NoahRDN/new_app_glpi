import type { CreateTicketPayload, TicketFilters } from "./ticket.types";

export const createTicketDefault : CreateTicketPayload = {
  name: "Ticket New App",
  content: "First Création ticket new app",
  type: 1,
  priority: 10,
};

export const ticketFilterDefault : TicketFilters = {
  name: "",
};

export type TicketStatusKeyword = {
  statusId: number;
  label: string;
  keywords: string[];
};

export const ticketStatusKeywords: TicketStatusKeyword[] = [
  {
    statusId: 1,
    label: "Nouveau",
    keywords: ["new", "nouveau"],
  },
  {
    statusId: 2,
    label: "Assigné",
    keywords: [
      "processing assigned",
      "processing (assigned)",
      "assigne",
      "assigné",
      "en cours assigne",
      "en cours assigné",
    ],
  },
  {
    statusId: 3,
    label: "Planifié",
    keywords: [
      "processing planned",
      "processing (planned)",
      "planifie",
      "planifié",
      "en cours planifie",
      "en cours planifié",
    ],
  },
  {
    statusId: 4,
    label: "En attente",
    keywords: ["pending", "en attente", "attente"],
  },
  {
    statusId: 5,
    label: "Résolu",
    keywords: ["solved", "resolu", "résolu"],
  },
  {
    statusId: 6,
    label: "Fermé",
    keywords: ["closed", "ferme", "fermé", "clos"],
  },
];
