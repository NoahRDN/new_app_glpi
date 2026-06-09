import { useDashboardStats } from "../../features/backoffice/dashboard/hooks/useDashboardStats";

export function DashboardPage() {
  const {
    data: stats,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useDashboardStats();

  if (isPending) {
    return <p>Chargement du dashboard...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Impossible de charger les statistiques du dashboard.</p>
        {import.meta.env.DEV && (
          <pre className="text-xs">{error instanceof Error ? error.message : String(error)}</pre>
        )}
      </div>
    );
  }

  if (!stats) {
    return <p>Aucune statistique disponible.</p>;
  }

  return (
    <div className="grid gap-6">
      <button type="button" onClick={() => refetch()}>
        {isFetching ? "Actualisation..." : "Actualiser"}
      </button>

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
        <p className="text-sm text-[var(--text-secondary)]">Tickets</p>
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