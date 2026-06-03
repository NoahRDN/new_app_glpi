import { ticketsMock } from "../../../entities/ticket/model/ticket.mock";
import { Badge } from "../../../shared/ui/Badge";
import { Card } from "../../../shared/ui/Card";
import { formatRelativeDate } from "../../../shared/lib/formatDate";

export function TicketList() {
  return (
    <Card
      className="xl:col-span-8"
      title="Tickets recents"
      description="Exemple de feature isolee autour de l'entite ticket."
    >
      <div className="flex flex-col gap-4">
        {ticketsMock.map((ticket) => (
          <article
            key={ticket.id}
            className="grid gap-3 pb-3 last:pb-0 md:grid-cols-[minmax(0,1.6fr)_auto_auto_auto] md:items-center"
            style={{
              borderBottom: "1px solid var(--panel-border)",
            }}
          >
            <div>
              <strong className="text-(--text-primary)">{ticket.title}</strong>
              <p className="text-sm text-(--text-secondary)">
                #{ticket.id} • {ticket.requester}
              </p>
            </div>
            <Badge tone={ticket.priority === "critical" ? "danger" : "default"}>
              {ticket.priority}
            </Badge>
            <Badge tone={ticket.status === "resolved" ? "success" : "warning"}>
              {ticket.status}
            </Badge>
            <span className="text-sm text-(--text-secondary)">{formatRelativeDate(ticket.updatedAt)}</span>
          </article>
        ))}
      </div>
    </Card>
  );
}
