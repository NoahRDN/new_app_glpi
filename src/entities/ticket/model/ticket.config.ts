import type { CreateTicketPayload, TicketFilters } from "./ticket.types";

export const TICKET_STATUS_IDS = {
  NEW: 1,
  ASSIGNED: 2,
  PLANNED: 3,
  PENDING: 4,
  SOLVED: 5,
  CLOSED: 6,
} as const;

export const TICKET_IN_PROGRESS_STATUS_IDS: readonly number[] = [
  TICKET_STATUS_IDS.ASSIGNED,
  TICKET_STATUS_IDS.PLANNED,
  TICKET_STATUS_IDS.PENDING,
] as const;

export const TICKET_DONE_STATUS_IDS: readonly number[] = [
  TICKET_STATUS_IDS.SOLVED,
  TICKET_STATUS_IDS.CLOSED,
] as const;

export const TICKET_SOLUTION_STATUS_IDS = {
  NONE: 1,
  WAITING: 2,
  ACCEPTED: 3,
  REFUSED: 4,
} as const;

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
    statusId: TICKET_STATUS_IDS.NEW,
    label: "Nouveau",
    keywords: ["new", "nouveau"],
  },
  {
    statusId: TICKET_STATUS_IDS.ASSIGNED,
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
    statusId: TICKET_STATUS_IDS.PLANNED,
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
    statusId: TICKET_STATUS_IDS.PENDING,
    label: "En attente",
    keywords: ["pending", "en attente", "attente"],
  },
  {
    statusId: TICKET_STATUS_IDS.SOLVED,
    label: "Résolu",
    keywords: ["solved", "resolu", "résolu"],
  },
  {
    statusId: TICKET_STATUS_IDS.CLOSED,
    label: "Fermé",
    keywords: ["closed", "ferme", "fermé", "clos"],
  },
];
