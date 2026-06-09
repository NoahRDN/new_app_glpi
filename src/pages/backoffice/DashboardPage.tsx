import { useDashboardStats } from "../../features/backoffice/dashboard/hooks/useDashboardStats";

export function DashboardPage() {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <p>Chargement du dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stats) {
    return <p>Aucune statistique disponible.</p>;
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Éléments du parc
        </p>
        <p className="text-4xl font-semibold text-[var(--text-primary)]">
          {stats.totalAssets}
        </p>

        <div className="mt-4 grid gap-2">
          {stats.assetsByType.map((item) => (
            <div key={item.key} className="flex justify-between">
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Tickets
        </p>
        <p className="text-4xl font-semibold text-[var(--text-primary)]">
          {stats.totalTickets}
        </p>

        <div className="mt-4 grid gap-2">
          {stats.ticketsByType.map((item) => (
            <div key={item.key} className="flex justify-between">
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}