import {
  BadgeDollarSign,
  SquareKanban,
  Calendar,
  User,
  LayoutDashboard,
  FileSpreadsheet,
  RotateCcw,
} from "lucide-react";
import type { OfficeNavigationItem } from "./officeNavigation.types";

export type BackOfficeSectionId =
  | "dashboard"
  | "tickets"
  | "assets"
  | "knowledge-base"
  | "users"
  | "import-data"
  | "reset-data";

export const backOfficeNavigation: OfficeNavigationItem[] = [
  {
    id: "dashboard",
    path: "/admin",
    label: "Administration",
    description: "Vue analytique et configuration avancée",
    Icon: LayoutDashboard,
  },
  {
    id: "tickets",
    path: "/admin/tickets",
    label: "Tickets",
    description: "Synthèse globale et activité récente",
    Icon: SquareKanban,
  },
  {
    id: "assets",
    path: "/admin/assets",
    label: "Parc",
    description: "Ordinateurs, matériels et inventaire",
    Icon: BadgeDollarSign,
  },
  {
    id: "knowledge-base",
    path: "/admin/knowledge-base",
    label: "Base de connaissances",
    description: "Organisation, process et documentation",
    Icon: Calendar,
  },
  {
    id: "users",
    path: "/admin/users",
    label: "Utilisateurs",
    description: "Gestion des utilisateurs GLPI",
    Icon: User,
  },
  {
    id: "import-data",
    path: "/admin/import-data",
    label: "Import data",
    description: "Import CSV multi-ressources GLPI",
    Icon: FileSpreadsheet,
  },
  {
    id: "reset-data",
    path: "/admin/reset-data",
    label: "Reset data",
    description: "Réinitialisation multi-ressources GLPI",
    Icon: RotateCcw,
  },
];
