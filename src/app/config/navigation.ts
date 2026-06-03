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
    label: "Administration",
    description: "Vue analytique et configuration avancee",
    shortKey: "01",
  },
  {
    id: "tickets",
    label: "Overview",
    description: "Synthese globale et activite recente",
    shortKey: "02",
  },
  {
    id: "assets",
    label: "Sales",
    description: "Commandes, flux et operations de vente",
    shortKey: "03",
  },
  {
    id: "knowledge-base",
    label: "Schedule",
    description: "Organisation, process et documentation",
    shortKey: "04",
  },
];
