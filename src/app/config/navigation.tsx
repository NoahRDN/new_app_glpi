import type { ReactNode } from "react";

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
  icon: ReactNode;
};

export const appNavigation: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Administration",
    description: "Vue analytique et configuration avancee",
    shortKey: "01",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="5" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        <circle
          cx="13"
          cy="5"
          r="2.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="5"
          cy="13"
          r="2.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="13"
          cy="13"
          r="2.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    id: "tickets",
    label: "Overview",
    description: "Synthese globale et activite recente",
    shortKey: "02",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2.5 14.5H15.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 14V7.5H7V14" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M7.75 14V3.5H10.75V14"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M11.5 14V9H14.5V14" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    id: "assets",
    label: "Sales",
    description: "Commandes, flux et operations de vente",
    shortKey: "03",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2.5"
          y="3"
          width="13"
          height="3"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="2.5"
          y="7.5"
          width="13"
          height="3"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="2.5"
          y="12"
          width="13"
          height="3"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    id: "knowledge-base",
    label: "Schedule",
    description: "Organisation, process et documentation",
    shortKey: "04",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2.5"
          y="2.5"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="10.5"
          y="2.5"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="2.5"
          y="10.5"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="10.5"
          y="10.5"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
];
