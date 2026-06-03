import { type LucideIcon ,BadgeDollarSign,SquareKanban,Calendar,User, LayoutDashboard } from "lucide-react"

export type AppSectionId =
  | "dashboard"
  | "tickets"
  | "assets"
  | "knowledge-base"
  | "users";

export type NavigationItem = {
  id: AppSectionId;
  label: string;
  description: string;
  Icon: LucideIcon;
};

export const appNavigation: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Administration",
    description: "Vue analytique et configuration avancee",
    Icon: LayoutDashboard,
  },
  {
    id: "tickets",
    label: "Overview",
    description: "Synthese globale et activite recente",
    Icon: SquareKanban,
  },
  {
    id: "assets",
    label: "Sales",
    description: "Commandes, flux et operations de vente",
    Icon: BadgeDollarSign,
  },
  {
    id: "knowledge-base",
    label: "Schedule",
    description: "Organisation, process et documentation",
    Icon: Calendar,
  },
  {
    id: "users",
    label: "Users",
    description: "Liste des utilisateurs",
    Icon: User,
  },
];
