import { glpiGetPaginated } from "../../../shared/api/glpiClient";
import type { DashboardStats } from "../model/dashboard.types";

type CountTarget = {
  key: string;
  label: string;
  path: string;
};

const assetTargets: CountTarget[] = [
  {
    key: "computers",
    label: "Ordinateurs",
    path: "/Assets/Computer",
  },
  {
    key: "printers",
    label: "Imprimantes",
    path: "/Assets/Printer",
  },
  {
    key: "monitors",
    label: "Moniteurs",
    path: "/Assets/Monitor",
  },
  {
    key: "phones",
    label: "Téléphones",
    path: "/Assets/Phone",
  },
  {
    key: "network-equipments",
    label: "Matériels réseau",
    path: "/Assets/NetworkEquipment",
  },
];

const ticketTargets: CountTarget[] = [
  {
    key: "incidents",
    label: "Incidents",
    path: "/Assistance/Ticket?filter=type==1",
  },
  {
    key: "requests",
    label: "Demandes",
    path: "/Assistance/Ticket?filter=type==2",
  },
];

function withCountLimit(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}start=0&limit=1`;
}

async function getCount(path: string): Promise<number> {
  const result = await glpiGetPaginated<unknown>(withCountLimit(path));

  if (result.total > 0) {
    return result.total;
  }

  return result.data.length;
}

async function getCountDetails(targets: CountTarget[]) {
  const details = await Promise.all(
    targets.map(async (target) => ({
      key: target.key,
      label: target.label,
      count: await getCount(target.path),
    })),
  );

  return details;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [assetsByType, ticketsByType, totalTickets] = await Promise.all([
    getCountDetails(assetTargets),
    getCountDetails(ticketTargets),
    getCount("/Assistance/Ticket"),
  ]);

  const totalAssets = assetsByType.reduce(
    (sum, assetType) => sum + assetType.count,
    0,
  );

  return {
    totalAssets,
    assetsByType,
    totalTickets,
    ticketsByType,
  };
}