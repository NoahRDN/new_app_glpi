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

export const BUILT_IN_GLPI_IMPORT_PROFILES: GlpiImportProfile[] = [
  GLPI_USER_PROFILE,
  GLPI_TICKET_PROFILE,
  GLPI_COMPUTER_PROFILE,
  GLPI_LOCATION_PROFILE,
  GLPI_PRINTER_PROFILE,
  GLPI_GROUP_PROFILE,
];
