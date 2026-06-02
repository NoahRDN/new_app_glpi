import { DashboardOverview } from "../features/dashboard-overview/components/DashboardOverview";
import { OAuthSetupCard } from "../features/oauth-setup/components/OAuthSetupCard";
import { Card } from "../shared/ui/Card";

export function DashboardPage() {
  return (
    <>
      <DashboardOverview />
      <OAuthSetupCard />
      <Card
        className="xl:col-span-12"
        title="Organisation du code"
        description="Cette page te montre la forme du projet, pas encore la logique GLPI finale."
      >
        <ul className="list-disc space-y-2 pl-4 text-sm text-slate-500">
          <li>`app` pour le shell, la navigation et les providers globaux</li>
          <li>`pages` pour les ecrans complets</li>
          <li>`features` pour les cas d'usage UI et metier</li>
          <li>`entities` pour les objets GLPI et leur acces API</li>
          <li>`shared` pour le client HTTP, config, UI generique et utilitaires</li>
        </ul>
      </Card>
    </>
  );
}
