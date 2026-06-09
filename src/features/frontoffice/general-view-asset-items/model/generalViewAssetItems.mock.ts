import type { GeneralViewAssetItems } from "./generalViewAssetItems.types";

export const generalViewAssetItemsMock: GeneralViewAssetItems[] = [
  {
    id: 1,
    is_deleted: false,
    itemType: "Computer",
    itemTypeLabel: "Ordinateur",
    dateCreation: "2026-06-05T17:55:40.618Z",
    dateMod: "2026-06-06T08:22:14.105Z",
    entity: {
      completename: "Racine > Direction Informatique",
      id: 1,
      name: "Direction Informatique",
    },
    isRecursive: true,
    manufacturer: {
      id: 1,
      name: "Dell",
    },
    name: "PC-BUREAU-001",
    status: {
      id: 2,
      name: "En service",
    },
    user: {
      id: 12,
      name: "Jean Rakoto",
    },
    userTech: {
      id: 5,
      name: "Support N1",
    },
  },
  {
    id: 2,
    is_deleted: false,
    itemType: "Printer",
    itemTypeLabel: "Imprimante",
    dateCreation: "2026-05-14T09:10:12.000Z",
    dateMod: "2026-06-04T15:42:18.000Z",
    entity: {
      completename: "Racine > Agence Analakely",
      id: 2,
      name: "Agence Analakely",
    },
    isRecursive: false,
    manufacturer: {
      id: 2,
      name: "HP",
    },
    name: "LAPTOP-COM-014",
    status: {
      id: 3,
      name: "En maintenance",
    },
    user: {
      id: 21,
      name: "Sarah Andriam",
    },
    userTech: {
      id: 7,
      name: "Technicien Parc",
    },
  },
  {
    id: 3,
    is_deleted: false,
    itemType: "Monitor",
    itemTypeLabel: "Moniteur",
    dateCreation: "2026-04-28T11:32:45.900Z",
    dateMod: "2026-06-03T10:17:51.221Z",
    entity: {
      completename: "Racine > Support > Antananarivo",
      id: 3,
      name: "Support Antananarivo",
    },
    isRecursive: true,
    manufacturer: {
      id: 3,
      name: "Lenovo",
    },
    name: "WS-DEV-023",
    status: {
      id: 1,
      name: "Stock",
    },
    user: {
      id: 0,
      name: "Non affecté",
    },
    userTech: {
      id: 9,
      name: "Equipe Infrastructure",
    },
  },
  {
    id: 4,
    is_deleted: false,
    itemType: "NetworkEquipment",
    itemTypeLabel: "Equipement réseau",
    dateCreation: "2026-03-18T07:25:10.000Z",
    dateMod: "2026-06-02T09:14:33.000Z",
    entity: {
      completename: "Racine > Infrastructure > Datacenter",
      id: 4,
      name: "Datacenter",
    },
    isRecursive: true,
    manufacturer: {
      id: 4,
      name: "Cisco",
    },
    name: "SW-CORE-01",
    status: {
      id: 2,
      name: "En service",
    },
    user: {
      id: 3,
      name: "Equipe Réseau",
    },
    userTech: {
      id: 10,
      name: "Admin Réseau",
    },
  },
];
