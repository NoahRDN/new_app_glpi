import {
  type LucideIcon,
  BadgeDollarSign,
  SquareKanban,
  Calendar,
  User,
  LayoutDashboard,
} from "lucide-react";

export type AppSectionId =
  | "dashboard"
  | "tickets"
  | "assets"
  | "knowledge-base"
  | "users";

export type NavigationItem = {
  id: AppSectionId;
  path: string;
  label: string;
  description: string;
  Icon: LucideIcon;
};

export const appNavigation: NavigationItem[] = [
  {
    id: "dashboard",
    path: "/",
    label: "Administration",
    description: "Vue analytique et configuration avancée",
    Icon: LayoutDashboard,
  },
  {
    id: "tickets",
    path: "/tickets",
    label: "Tickets",
    description: "Synthèse globale et activité récente",
    Icon: SquareKanban,
  },
  {
    id: "assets",
    path: "/assets",
    label: "Parc",
    description: "Ordinateurs, matériels et inventaire",
    Icon: BadgeDollarSign,
  },
  {
    id: "knowledge-base",
    path: "/knowledge-base",
    label: "Base de connaissances",
    description: "Organisation, process et documentation",
    Icon: Calendar,
  },
  {
    id: "users",
    path: "/users",
    label: "Utilisateurs",
    description: "Liste des utilisateurs",
    Icon: User,
  },
];