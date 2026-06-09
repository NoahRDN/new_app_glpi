import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../../../entities/dashboard/api/dashboard.api";

export const dashboardStatsQueryKey = ["dashboard", "stats"] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardStatsQueryKey,
    queryFn: getDashboardStats,
    staleTime: 60_000,
    retry: 1,
  });
}