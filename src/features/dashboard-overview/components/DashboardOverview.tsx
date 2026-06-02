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
          <p className="text-4xl leading-none font-semibold text-slate-800">{metric.value}</p>
        </Card>
      ))}
    </>
  );
}
