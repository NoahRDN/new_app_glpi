import { CircleDollarSign, Globe, Kanban, TicketPlus } from "lucide-react";
import type { OfficeNavigationItem } from "./officeNavigation.types";

export const frontOfficeNavigation: OfficeNavigationItem[] = [
  {
    description: "Vue General Element",
    Icon: Globe,
    id: "asset-general-element",
    label: "Vue General Element",
    path: "/asset-general-element",
  },
  {
    description: "Création ticket",
    Icon: TicketPlus,
    id: "create-ticket",
    label: "Création Ticket",
    path: "/create-ticket",
  },
  {
    description: "Ticket Kanban",
    Icon: Kanban,
    id: "ticket-kanban",
    label: "Ticket Kanban",
    path: "/ticket-kanban",
  },
  {
    description: "Montant Cost Local Saisie et GLPI",
    Icon: CircleDollarSign,
    id: "montant-local-glpi",
    label: "Cost Local & GLPI",
    path: "/montant-local-glpi",
    // isHorizontalRowDown: true,
  },
  // {
  //   description: "Page d'accueil du portail",
  //   Icon: House,
  //   id: "front-home",
  //   label: "Accueil",
  //   path: "/",
  // },
  // {
  //   description: "Catalogue des services IT",
  //   Icon: MonitorSmartphone,
  //   id: "front-portal",
  //   label: "Portail",
  //   path: "/portal",
  // },
  // {
  //   description: "Base documentaire publique",
  //   Icon: LifeBuoy,
  //   id: "front-help",
  //   label: "Aide",
  //   path: "/help-center",
  // },
  // {
  //   description: "Accès utilisateur",
  //   Icon: UserRound,
  //   id: "front-account",
  //   label: "Mon espace",
  //   path: "/account",
  // },
 
  
];
