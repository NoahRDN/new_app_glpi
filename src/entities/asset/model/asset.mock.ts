import type { Asset } from "./asset.types";

export const assetsMock: Asset[] = [
  {
    id: 1,
    name: "Dell Latitude 5440",
    type: "Laptop",
    status: "in_service",
    assignedTo: "Miora",
    location: "Antananarivo",
  },
  {
    id: 2,
    name: "HP LaserJet M404",
    type: "Printer",
    status: "maintenance",
    assignedTo: "Front Desk",
    location: "Tamatave",
  },
  {
    id: 3,
    name: "Cisco CBS250-24T",
    type: "Switch",
    status: "in_service",
    assignedTo: "Infrastructure",
    location: "Siege",
  },
];
