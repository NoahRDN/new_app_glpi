export type DashboardStatDetail = {
  key: string;
  label: string;
  count: number;
};

export type DashboardStats = {
  totalAssets: number;
  assetsByType: DashboardStatDetail[];

  totalTickets: number;
  ticketsByType: DashboardStatDetail[];
};

export type CountTarget = {
  key: string;
  label: string;
  path: string;
};