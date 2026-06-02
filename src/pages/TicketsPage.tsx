import { TicketList } from "../features/ticket-list/components/TicketList";
import { Card } from "../shared/ui/Card";

export function TicketsPage() {
  return (
    <>
      <TicketList />
      <Card
        className="xl:col-span-4"
        title="Pistes GLPI"
        description="Exemples de modules a brancher ici quand tu auras l'API cible."
      >
        <ul className="list-disc space-y-2 pl-4 text-sm text-slate-500">
          <li>liste des tickets avec filtres statut, urgence, technicien</li>
          <li>detail d'un ticket avec suivis, taches et solution</li>
          <li>creation rapide d'incident ou de demande</li>
        </ul>
      </Card>
    </>
  );
}
