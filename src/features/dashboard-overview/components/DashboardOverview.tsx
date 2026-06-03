import { Card } from "../../../shared/ui/Card";
import { ticketsMock } from "../../../entities/ticket/model/ticket.mock";
import { assetsMock } from "../../../entities/asset/model/asset.mock";

function countOpenTickets() {
  return ticketsMock.filter((ticket) => ticket.status !== "resolved").length;
}

function countCriticalTickets() {
  return ticketsMock.filter((ticket) => ticket.priority === "critical").length;
}

export function DashboardOverview() {
  const metrics = [
    { label: "Tickets ouverts", value: countOpenTickets(), tone: "default" as const },
    { label: "Critiques", value: countCriticalTickets(), tone: "danger" as const },
    { label: "Assets suivis", value: assetsMock.length, tone: "success" as const },
  ];

  return (
    <>
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="md:col-span-4 xl:col-span-4"
          title={metric.label}
          description="Valeur de demonstration"
          tone={metric.tone}
        >
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-(--panel-soft) text-lg">
            {metric.tone === "danger" ? "↓" : "↑"}
          </div>
          <p className="text-4xl leading-none font-semibold text-(--text-primary)">{metric.value}</p>
          <p className="mt-3 text-sm text-(--text-secondary)">
            {metric.tone === "danger" ? "20.15 %" : "105.23 %"}
          </p>
        </Card>
      ))}
    </>
  );
}
