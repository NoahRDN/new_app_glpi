import { ArrowLeft, CalendarClock, CircleAlert, FolderOpen, User } from "lucide-react";
import { Link, useParams } from "react-router";
import { useTicket } from "../../features/backoffice/ticket/hooks/useTickets";
import { getUserErrorMessage } from "../../shared/errors/AppError";
import { Button } from "../../shared/ui/Button";
import { Loader } from "../../shared/ui/Loader";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-[20px] border p-4" style={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)" }}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {value === null || value === undefined || value === "" ? "-" : String(value)}
      </p>
    </div>
  );
}

export function TicketDetailPage() {
  const params = useParams();
  const ticketId = Number(params.ticketId);
  const normalizedTicketId = Number.isFinite(ticketId) ? ticketId : null;
  const { data: ticket, isPending, isError, error } = useTicket(normalizedTicketId);

  if (normalizedTicketId === null) {
    return (
      <div className="col-span-12 text-red-500">
        Identifiant de ticket invalide.
      </div>
    );
  }

  if (isPending) {
    return <Loader label="Chargement du détail du ticket" />;
  }

  if (isError || !ticket) {
    return (
      <div className="col-span-12 text-red-500">
        {getUserErrorMessage(error, "Impossible de charger le détail du ticket.")}
      </div>
    );
  }

  return (
    <section className="col-span-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border p-6 shadow-(--shadow-soft)" style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-secondary)" }}>
            Ticket #{ticket.id}
          </p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {ticket.name}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {ticket.status?.name ?? "-"} • Priorité {ticket.priority} • Urgence {ticket.urgency} • Impact {ticket.impact}
          </p>
        </div>

        <Link to="/admin/tickets">
          <Button type="button">
            <ArrowLeft size={18} />
            Retour à la liste
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 rounded-[28px] border p-6 shadow-(--shadow-soft) xl:col-span-8" style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}>
          <div className="flex items-center gap-3">
            <CircleAlert size={18} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Description
            </h2>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7" style={{ color: "var(--text-primary)" }}>
            {ticket.content || "-"}
          </p>
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-5 xl:col-span-4">
          <div className="rounded-[28px] border p-6 shadow-(--shadow-soft)" style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}>
            <div className="flex items-center gap-3">
              <User size={18} />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Intervenants
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              <DetailItem label="Demandeur" value={ticket.user_recipient?.name} />
              <DetailItem label="Éditeur" value={ticket.user_editor?.name} />
            </div>
          </div>

          <div className="rounded-[28px] border p-6 shadow-(--shadow-soft)" style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}>
            <div className="flex items-center gap-3">
              <FolderOpen size={18} />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Classification
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              <DetailItem label="Catégorie" value={ticket.category?.name} />
              <DetailItem label="Lieu" value={ticket.location?.name} />
              <DetailItem label="Entité" value={ticket.entity?.name} />
              <DetailItem label="Type de demande" value={ticket.request_type?.name} />
            </div>
          </div>
        </div>

        <div className="col-span-12 rounded-[28px] border p-6 shadow-(--shadow-soft)" style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}>
          <div className="flex items-center gap-3">
            <CalendarClock size={18} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Chronologie
            </h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailItem label="Date création" value={formatDate(ticket.date_creation)} />
            <DetailItem label="Date modification" value={formatDate(ticket.date_mod)} />
            <DetailItem label="Prise en compte" value={formatDate(ticket.take_into_account_date)} />
            <DetailItem label="Résolution" value={formatDate(ticket.resolution_date)} />
            <DetailItem label="Date de clôture" value={formatDate(ticket.date_close)} />
            <DetailItem label="Début attente" value={formatDate(ticket.begin_waiting_date)} />
            <DetailItem label="Date solve" value={formatDate(ticket.date_solve)} />
            <DetailItem label="Date ticket" value={formatDate(ticket.date)} />
          </div>
        </div>

        <div className="col-span-12 rounded-[28px] border p-6 shadow-(--shadow-soft)" style={{ backgroundColor: "var(--panel-strong)", borderColor: "var(--panel-border)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Éléments complémentaires
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailItem label="Action time" value={ticket.actiontime} />
            <DetailItem label="Waiting duration" value={ticket.waiting_duration} />
            <DetailItem label="Resolution duration" value={ticket.resolution_duration} />
            <DetailItem label="Close duration" value={ticket.close_duration} />
            <DetailItem label="SLA TTR" value={ticket.sla_ttr?.name} />
            <DetailItem label="SLA TTO" value={ticket.sla_tto?.name} />
            <DetailItem label="OLA TTR" value={ticket.ola_ttr?.name} />
            <DetailItem label="OLA TTO" value={ticket.ola_tto?.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
