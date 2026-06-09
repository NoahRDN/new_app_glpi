import { Eye, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { useTickets } from "../hooks/useTickets";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ListTicket() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const {
    data: tickets = [],
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useTickets();

  const visibleTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      if (ticket.is_deleted) {
        return false;
      }

      if (query.length === 0) {
        return true;
      }

      return [
        ticket.name,
        ticket.content,
        ticket.status?.name,
        ticket.category?.name,
        ticket.user_recipient?.name,
        ticket.user_editor?.name,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [search, tickets]);

  if (isPending) {
    return <Loader label="Chargement de la liste des tickets" />;
  }

  if (isError) {
    return (
      <div className="col-span-12 text-red-500">
        {getUserErrorMessage(error, "Impossible de charger les tickets.")}
      </div>
    );
  }

  return (
    <DataTable
      tableHeads={[
        <Input type="checkbox" />,
        "N°",
        "Titre",
        "Statut",
        "Priorité",
        "Demandeur",
        "Catégorie",
        "Date création",
        "Action",
      ]}
      toolbar={(
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[22px] px-5 py-4">
          <Input
            placeholder="Rechercher par titre, contenu, statut, catégorie..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Button type="button" onClick={() => refetch()}>
            <RefreshCcw size={18} />
            {isFetching ? "Actualisation..." : "Actualiser"}
          </Button>
        </div>
      )}
      toolbarFooter={(
        <div className="col-span-12 mt-4 flex items-center justify-between">
          <p className="text-sm text-(--text-secondary)">
            {visibleTickets.length} ticket(s) affiché(s) sur {tickets.filter((ticket) => !ticket.is_deleted).length}
          </p>
        </div>
      )}
    >
      {visibleTickets.map((ticket, index) => (
        <tr key={ticket.id}>
          <td className="px-4 py-3">
            <Input type="checkbox" />
          </td>
          <td className="px-4 py-3">{index + 1}</td>
          <td className="px-4 py-3">{ticket.name}</td>
          <td className="px-4 py-3">{ticket.status?.name ?? "-"}</td>
          <td className="px-4 py-3">{ticket.priority}</td>
          <td className="px-4 py-3">{ticket.user_recipient?.name ?? "-"}</td>
          <td className="px-4 py-3">{ticket.category?.name ?? "-"}</td>
          <td className="px-4 py-3">{formatDate(ticket.date_creation)}</td>
          <td className="px-4 py-3">
            <Button
              aria-label="Voir le détail du ticket"
              otherClassName="bg-blue-400"
              onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
            >
              <Eye size={18} />
            </Button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
