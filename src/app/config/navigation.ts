export type AppSectionId =
  | "dashboard"
  | "tickets"
  | "assets"
  | "knowledge-base";

export type NavigationItem = {
  id: AppSectionId;
  label: string;
  description: string;
  shortKey: string;
};

export const appNavigation: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Clients OAuth",
    description: "Configuration des connexions et des redirections",
    shortKey: "01",
  },
  {
    id: "tickets",
    label: "Tickets",
    description: "Suivi des incidents, urgences et SLA",
    shortKey: "02",
  },
  {
    id: "assets",
    label: "Parc",
    description: "Inventaire postes, reseau et peripheriques",
    shortKey: "03",
  },
  {
    id: "knowledge-base",
    label: "Base de connaissances",
    description: "Documentation interne et procedures support",
    shortKey: "04",
  },
];
