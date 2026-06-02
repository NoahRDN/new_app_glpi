export type AssetStatus = "in_service" | "maintenance" | "retired";

export type Asset = {
  assignedTo: string;
  id: number;
  location: string;
  name: string;
  status: AssetStatus;
  type: "Laptop" | "Printer" | "Switch";
};
