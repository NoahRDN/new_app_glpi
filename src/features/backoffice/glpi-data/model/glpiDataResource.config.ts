export type GlpiDataResourceId =
  | "users"
  | "tickets"
  | "computers"
  | "monitors"
  | "phones"
  | "printers"
  | "states"
  | "locations"
  | "manufacturers"
  | "computerModels"
  | "monitorModels"
  | "groups"
  | "documents";

export type GlpiDataResourceConfig = {
  description: string;
  endpoint: string;
  id: GlpiDataResourceId;
  label: string;
  optionalColumns: string[];
  requiredColumns: string[];
  resetEnabled: boolean;
  protectedIds?: number[];
  reason?: string;
};

export const GLPI_DATA_RESOURCES: GlpiDataResourceConfig[] = [
  {
    description: "Comptes utilisateurs GLPI.",
    endpoint: "/Administration/User",
    id: "users",
    label: "Utilisateurs",
    optionalColumns: [],
    requiredColumns: ["username", "realname", "firstname"],
    resetEnabled: true,
    protectedIds: [2,3,4,5,6],
    reason: "ce sont des données essentiels au bon fonctionnement de GLPI"
  },
  {
    description: "Tickets de support et demandes.",
    endpoint: "/Assistance/Ticket",
    id: "tickets",
    label: "Tickets",
    optionalColumns: ["status", "priority", "urgency", "impact"],
    requiredColumns: ["name", "content"],
    resetEnabled: true,
  },
  {
    description: "Materiels du parc informatique.",
    endpoint: "/Assets/Computer",
    id: "computers",
    label: "Ordinateurs",
    optionalColumns: ["serial", "otherserial", "comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Moniteurs du parc informatique.",
    endpoint: "/Assets/Monitor",
    id: "monitors",
    label: "Moniteurs",
    optionalColumns: ["serial", "otherserial", "comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Telephones du parc informatique.",
    endpoint: "/Assets/Phone",
    id: "phones",
    label: "Telephones",
    optionalColumns: ["serial", "otherserial", "comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Imprimantes du parc informatique.",
    endpoint: "/Assets/Printer",
    id: "printers",
    label: "Imprimantes",
    optionalColumns: ["serial", "otherserial", "comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "États des matériels GLPI.",
    endpoint: "/Dropdowns/State",
    id: "states",
    label: "États",
    optionalColumns: [],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Emplacements et sites.",
    endpoint: "/Dropdowns/Location",
    id: "locations",
    label: "Emplacements",
    optionalColumns: ["comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Fabricants GLPI.",
    endpoint: "/Dropdowns/Manufacturer",
    id: "manufacturers",
    label: "Fabricants",
    optionalColumns: [],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Modèles d'ordinateurs GLPI.",
    endpoint: "/Dropdowns/ComputerModel",
    id: "computerModels",
    label: "Modèles ordinateur",
    optionalColumns: [],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Modèles de moniteurs GLPI.",
    endpoint: "/Dropdowns/MonitorModel",
    id: "monitorModels",
    label: "Modèles moniteur",
    optionalColumns: [],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Groupes fonctionnels GLPI.",
    endpoint: "/Administration/Group",
    id: "groups",
    label: "Groupes",
    optionalColumns: ["comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Documents GLPI crees a partir d'archives images.",
    endpoint: "/Management/Document",
    id: "documents",
    label: "Documents",
    optionalColumns: ["filename", "comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
];

export function getGlpiDataResource(resourceId: GlpiDataResourceId) {
  const resource = GLPI_DATA_RESOURCES.find((item) => item.id === resourceId);

  if (!resource) {
    throw new Error(`Ressource GLPI inconnue: ${resourceId}`);
  }

  return resource;
}
