export type GlpiDataResourceId =
  | "users"
  | "tickets"
  | "computers"
  | "locations"
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
    endpoint: "/Assets/Ticket",
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
    description: "Emplacements et sites.",
    endpoint: "/Assets/Location",
    id: "locations",
    label: "Emplacements",
    optionalColumns: ["comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Groupes fonctionnels GLPI.",
    endpoint: "/Assets/Group",
    id: "groups",
    label: "Groupes",
    optionalColumns: ["comment"],
    requiredColumns: ["name"],
    resetEnabled: true,
  },
  {
    description: "Documents GLPI crees a partir d'archives images.",
    endpoint: "/Assets/Document",
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
