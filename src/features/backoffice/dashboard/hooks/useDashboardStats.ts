import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../../entities/dashboard/api/dashboard.api";
import type { DashboardStats } from "../../../../entities/dashboard/model/dashboard.types";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardStats() {
      try {
        setIsLoading(true);
        setError("");

        const dashboardStats = await getDashboardStats();

        if (isMounted) {
          setStats(dashboardStats);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setError("Impossible de charger les statistiques du dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
}