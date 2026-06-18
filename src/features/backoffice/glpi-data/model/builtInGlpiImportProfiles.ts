import type { GlpiImportProfile } from "./glpiImportProfile.types";

export const GLPI_USER_PROFILE: GlpiImportProfile = {
  id: "glpi-users-v1",
  importOrder: 10,
  label: "Utilisateurs GLPI",
  mode: "single-resource",
  requiredHeaders: ["username", "realname", "firstname"],
  resourceMappings: {
    users: {
      firstname: {
        header: "firstname",
        required: true,
        transform: "trim",
      },
      realname: {
        header: "realname",
        required: true,
        transform: "trim",
      },
      username: {
        header: "username",
        required: true,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "username", label: "Username", resource: "users" },
    { field: "realname", label: "Realname", resource: "users" },
    { field: "firstname", label: "Firstname", resource: "users" },
  ],
};

export const GLPI_TICKET_PROFILE: GlpiImportProfile = {
  id: "glpi-tickets-v1",
  importOrder: 20,
  label: "Tickets GLPI",
  mode: "single-resource",
  requiredHeaders: ["name", "content"],
  resourceMappings: {
    tickets: {
      content: {
        header: "content",
        required: true,
        transform: "trim",
      },
      impact: {
        defaultValue: "3",
        header: "impact",
        required: false,
        transform: "number",
      },
      name: {
        header: "name",
        required: true,
        transform: "trim",
      },
      priority: {
        defaultValue: "3",
        header: "priority",
        required: false,
        transform: "number",
      },
      status: {
        defaultValue: "1",
        header: "status",
        required: false,
        transform: "number",
      },
      urgency: {
        defaultValue: "3",
        header: "urgency",
        required: false,
        transform: "number",
      },
    },
  },
  previewColumns: [
    { field: "name", label: "Titre", resource: "tickets" },
    { field: "content", label: "Contenu", resource: "tickets" },
    { field: "status", label: "Statut", resource: "tickets" },
    { field: "priority", label: "Priorite", resource: "tickets" },
  ],
};

export const GLPI_COMPUTER_PROFILE: GlpiImportProfile = {
  id: "glpi-computers-v1",
  importOrder: 30,
  label: "Ordinateurs GLPI",
  mode: "single-resource",
  requiredHeaders: ["name"],
  resourceMappings: {
    computers: {
      comment: {
        header: "comment",
        required: false,
        transform: "trim",
      },
      name: {
        header: "name",
        required: true,
        transform: "trim",
      },
      otherserial: {
        header: "otherserial",
        required: false,
        transform: "trim",
      },
      serial: {
        header: "serial",
        required: false,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "name", label: "Nom", resource: "computers" },
    { field: "serial", label: "Numero de serie", resource: "computers" },
    { field: "otherserial", label: "Inventaire", resource: "computers" },
    { field: "comment", label: "Commentaire", resource: "computers" },
  ],
};

export const GLPI_LOCATION_PROFILE: GlpiImportProfile = {
  id: "glpi-locations-v1",
  importOrder: 40,
  label: "Emplacements GLPI",
  mode: "single-resource",
  requiredHeaders: ["name"],
  resourceMappings: {
    locations: {
      comment: {
        header: "comment",
        required: false,
        transform: "trim",
      },
      name: {
        header: "name",
        required: true,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "name", label: "Nom", resource: "locations" },
    { field: "comment", label: "Commentaire", resource: "locations" },
  ],
};

export const GLPI_PRINTER_PROFILE: GlpiImportProfile = {
  id: "glpi-printers-v1",
  importOrder: 45,
  label: "Imprimantes GLPI",
  mode: "single-resource",
  requiredHeaders: ["name"],
  resourceMappings: {
    printers: {
      comment: {
        header: "comment",
        required: false,
        transform: "trim",
      },
      name: {
        header: "name",
        required: true,
        transform: "trim",
      },
      otherserial: {
        header: "otherserial",
        required: false,
        transform: "trim",
      },
      serial: {
        header: "serial",
        required: false,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "name", label: "Nom", resource: "printers" },
    { field: "serial", label: "Numero de serie", resource: "printers" },
    { field: "otherserial", label: "Inventaire", resource: "printers" },
    { field: "comment", label: "Commentaire", resource: "printers" },
  ],
};

export const GLPI_GROUP_PROFILE: GlpiImportProfile = {
  id: "glpi-groups-v1",
  importOrder: 50,
  label: "Groupes GLPI",
  mode: "single-resource",
  requiredHeaders: ["name"],
  resourceMappings: {
    groups: {
      comment: {
        header: "comment",
        required: false,
        transform: "trim",
      },
      name: {
        header: "name",
        required: true,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "name", label: "Nom", resource: "groups" },
    { field: "comment", label: "Commentaire", resource: "groups" },
  ],
};

export const GLPI_EVAL_ASSETS_JUIN_2026_PROFILE: GlpiImportProfile = {
  id: "glpi-eval-assets-juin-2026-v1",
  importOrder: 210,
  label: "Éval Juin 2026 - Feuille 1 Assets",
  mode: "single-resource",
  requiredHeaders: [
    "Name",
    "Status",
    "Location",
    "Manufacturer",
    "Item_Type",
    "Model",
    "Inventory_Number",
    "User",
  ],
  resourceMappings: {
    computers: {
      inventoryNumber: {
        header: "Inventory_Number",
        required: false,
        transform: "trim",
      },
      itemType: {
        header: "Item_Type",
        required: true,
        transform: "trim",
      },
      locationName: {
        header: "Location",
        required: false,
        transform: "trim",
      },
      manufacturerName: {
        header: "Manufacturer",
        required: false,
        transform: "trim",
      },
      modelName: {
        header: "Model",
        required: false,
        transform: "trim",
      },
      name: {
        header: "Name",
        required: true,
        transform: "trim",
      },
      statusLabel: {
        header: "Status",
        required: false,
        transform: "trim",
      },
      userName: {
        header: "User",
        required: false,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "name", label: "Nom", resource: "computers" },
    { field: "statusLabel", label: "Statut", resource: "computers" },
    { field: "locationName", label: "Emplacement", resource: "computers" },
    { field: "manufacturerName", label: "Fabricant", resource: "computers" },
    { field: "itemType", label: "Type", resource: "computers" },
    { field: "modelName", label: "Modèle", resource: "computers" },
    { field: "inventoryNumber", label: "Inventaire", resource: "computers" },
    { field: "userName", label: "Utilisateur", resource: "computers" },
  ],
};

export const GLPI_EVAL_TICKETS_JUIN_2026_PROFILE: GlpiImportProfile = {
  id: "glpi-eval-tickets-juin-2026-v1",
  importOrder: 220,
  label: "Éval Juin 2026 - Feuille 2 Tickets",
  mode: "single-resource",
  requiredHeaders: [
    "Ref_Ticket",
    "Date",
    "Heure",
    "Type",
    "Titre",
    "Description",
    "Status",
    "Priority",
    "Items",
  ],
  resourceMappings: {
    tickets: {
      content: {
        header: "Description",
        required: true,
        transform: "trim",
      },
      dateLabel: {
        header: "Date",
        required: false,
        transform: "trim",
      },
      hourLabel: {
        header: "Heure",
        required: false,
        transform: "trim",
      },
      itemsRaw: {
        header: "Items",
        required: false,
        transform: "trim",
      },
      name: {
        header: "Titre",
        required: true,
        transform: "trim",
      },
      priorityLabel: {
        header: "Priority",
        required: false,
        transform: "trim",
      },
      refTicket: {
        header: "Ref_Ticket",
        required: true,
        transform: "trim",
      },
      statusLabel: {
        header: "Status",
        required: false,
        transform: "trim",
      },
      typeLabel: {
        header: "Type",
        required: false,
        transform: "trim",
      },
    },
  },
  previewColumns: [
    { field: "refTicket", label: "Réf", resource: "tickets" },
    { field: "dateLabel", label: "Date", resource: "tickets" },
    { field: "hourLabel", label: "Heure", resource: "tickets" },
    { field: "typeLabel", label: "Type", resource: "tickets" },
    { field: "name", label: "Titre", resource: "tickets" },
    { field: "content", label: "Description", resource: "tickets" },
    { field: "statusLabel", label: "Statut", resource: "tickets" },
    { field: "priorityLabel", label: "Priorité", resource: "tickets" },
    { field: "itemsRaw", label: "Items", resource: "tickets" },
  ],
};

export const GLPI_EVAL_TICKET_COSTS_JUIN_2026_PROFILE: GlpiImportProfile = {
  id: "glpi-eval-ticket-costs-juin-2026-v1",
  importOrder: 230,
  label: "Éval Juin 2026 - Feuille 3 Coûts",
  mode: "single-resource",
  requiredHeaders: [
    "Num_Ticket",
    "Duration_second",
    "Time_Cost",
    "Fixed_Cost",
  ],
  resourceMappings: {
    tickets: {
      durationSecond: {
        header: "Duration_second",
        required: false,
        transform: "number",
      },
      fixedCost: {
        header: "Fixed_Cost",
        required: false,
        transform: "number",
      },
      ticketRef: {
        header: "Num_Ticket",
        required: true,
        transform: "trim",
      },
      timeCost: {
        header: "Time_Cost",
        required: false,
        transform: "number",
      },
    },
  },
  previewColumns: [
    { field: "ticketRef", label: "Ticket", resource: "tickets" },
    { field: "durationSecond", label: "Durée (s)", resource: "tickets" },
    { field: "timeCost", label: "Coût temps", resource: "tickets" },
    { field: "fixedCost", label: "Coût fixe", resource: "tickets" },
  ],
};

export const GLPI_SCENARIO_TICKET: GlpiImportProfile = {
  id: "scenario-ticket",
  importOrder: 500,
  label: "Scenario ticket",
  mode: "single-resource",
  requiredHeaders: [
    "Num_Ticket",
    "mvt",
    "valeur",
    "mode_reouverture"
  ],
  resourceMappings: {
    tickets: {
      ticketRef: {
        header: "Num_Ticket",
        required: true,
        transform: "trim",
      },
      mvt: {
        header: "mvt",
        required: true,
        transform: "trim",
      },
      valeur: {
        header: "valeur",
        required: true,
        transform: "number",
      },
      mode_reouverture: {
        header: "mode_reouverture",
        required: true,
        transform: "number",
      },
    },
  },
  previewColumns: [
    { field: "ticketRef", label: "Ticket", resource: "tickets" },
    { field: "mvt", label: "Mouvement", resource: "tickets" },
    { field: "valeur", label: "Valeur", resource: "tickets" },
    { field: "mode_reouverture", label: "mode_reouverture", resource: "tickets" },
  ],
};

export const BUILT_IN_GLPI_IMPORT_PROFILES: GlpiImportProfile[] = [
  GLPI_USER_PROFILE,
  GLPI_TICKET_PROFILE,
  GLPI_COMPUTER_PROFILE,
  GLPI_LOCATION_PROFILE,
  GLPI_PRINTER_PROFILE,
  GLPI_GROUP_PROFILE,
  GLPI_EVAL_ASSETS_JUIN_2026_PROFILE,
  GLPI_EVAL_TICKETS_JUIN_2026_PROFILE,
  GLPI_EVAL_TICKET_COSTS_JUIN_2026_PROFILE,
  GLPI_SCENARIO_TICKET
];
