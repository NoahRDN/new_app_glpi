import { Eye, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { useTicketsPage } from "../../../backoffice/ticket/hooks/useTickets";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import type { TicketFilters } from "../../../../entities/ticket/model/ticket.types";
import { ticketFilterDefault } from "../../../../entities/ticket/model/ticket.config";
import { Select } from "../../../../shared/ui/Select";
import { findTicketKanbanGroup, groupTicketsByKanban } from "../lib/ticketKanban";

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

export function ListTicketKanban() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TicketFilters>(ticketFilterDefault);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<number>(20);
  const debouncedFilters = useDebounce(filters, 400);

  const {
    data: ticketsPage,
    isPending: isTicketsPending,
    isFetching: isTicketsFetching,
    isError: isTicketsError,
    error: ticketsError,
    refetch,
  } = useTicketsPage(page, limit, debouncedFilters);

  const tickets = ticketsPage?.data ?? [];
  useMemo(() => {
    return groupTicketsByKanban(tickets);
  }, [tickets]);
  const total = ticketsPage?.total ?? 0;
  const hasNextPage = (page + 1) * limit < total;

  if (isTicketsPending) {
    return <Loader label="Chargement de la liste des tickets" />;
  }

  if (isTicketsError) {
    return (
      <div className="col-span-12 text-red-500">
        {getUserErrorMessage(ticketsError, "Impossible de charger les tickets.")}
      </div>
    );
  }

  return (<>
    <DataTable
      tableHeads={[
        <Input type="checkbox" />,
        "N°",
        "Titre",
        "Statut",
        "Statut Kanban",
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
            value={filters.name}
            onChange={(event) => {
              setFilters((currentFilters) => ({
                ...currentFilters,
                name: event.target.value,
              }));
              setPage(0);
            }}
          />

          <Button type="button" onClick={() => refetch()}>
            <RefreshCcw size={18} />
            {isTicketsFetching ? "Actualisation..." : "Actualiser"}
          </Button>
        </div>
      )}
      toolbarFooter={(
      <div className="col-span-12 mt-4 flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <p className="text-sm text-(--text-secondary)">
            {tickets.length} ticket(s) affiché(s) sur {total}
          </p>
        
          <Select
            isFullWidth={false}
            id="limitPrinterPagination"
            name="limitPrinterPagination"
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(0);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button
            disabled={page === 0}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Précédent
          </Button>

          <Button
            disabled={!hasNextPage}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
       
      )}
    >
      {tickets.map((ticket, index) => (
        <tr key={ticket.id}>
          <td className="border border-(--panel-border) px-4 py-4">
            <Input type="checkbox" />
          </td>
          <td className="border border-(--panel-border) px-4 py-4">{index + (page * limit) + 1}</td>
          <td className="border border-(--panel-border) px-4 py-4">{ticket.name}</td>
          <td className="border border-(--panel-border) px-4 py-4">{ticket.status?.name ?? "-"}</td>
          <td className="border border-(--panel-border) px-4 py-4">
            {findTicketKanbanGroup(ticket)?.label ?? "-"}
          </td>
          <td className="border border-(--panel-border) px-4 py-4">{ticket.priority}</td>
          <td className="border border-(--panel-border) px-4 py-4">{ticket.user_recipient?.name ?? "-"}</td>
          <td className="border border-(--panel-border) px-4 py-4">{ticket.category?.name ?? "-"}</td>
          <td className="border border-(--panel-border) px-4 py-4">{formatDate(ticket.date_creation)}</td>
          <td className="border border-(--panel-border) px-4 py-4">
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
  </>);
}
