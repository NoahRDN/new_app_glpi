import { glpiGetPaginated } from "../../../shared/api/glpiClient";
import { getAssets } from "../../asset/api/asset.api";
import { excludedAssetTypes } from "../model/dashboard.config";
import type { CountTarget, DashboardStats } from "../model/dashboard.types";

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
  const assetTargets = await getAssetTargets();

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

export async function getAssetTargets(): Promise<CountTarget[]> {
  const assets = await getAssets();

  return assets
    .filter((asset) => !excludedAssetTypes.includes(asset.itemtype))
    .map((asset) => ({
      key: asset.itemtype,
      label: asset.name,
      path: asset.href,
    }));
}