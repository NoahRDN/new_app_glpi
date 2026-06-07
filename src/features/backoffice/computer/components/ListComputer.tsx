import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { Button } from "../../../../shared/ui/Button";
import { useComputersPage } from "../hooks/useComputers";

export function ListComputer() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<number>(20);

  const {
    data: computersPage,
    isPending: isComputersPending,
    isFetching: isComputersFetching,
    isError: isComputersError,
    error: computersError,
    refetch: refetchComputers,
  } = useComputersPage(page, limit);

  const computers = computersPage?.data ?? [];
  const total = computersPage?.total ?? 0;
  const hasNextPage = (page + 1) * limit < total;

  const query = search.trim().toLowerCase();

  const visibleComputers = computers.filter((computer) => {
    if (computer.is_deleted) {
      return false;
    }

    if (query.length === 0) {
      return true;
    }

    return (
      computer.name?.toLowerCase().includes(query) ||
      computer.serial?.toLowerCase().includes(query) ||
      computer.otherserial?.toLowerCase().includes(query)
    );
  });

  if (isComputersPending) {
    return <Loader label="Chargement de la liste des ordinateurs" />;
  }

  if (isComputersError) {
    return (
      <div className="col-span-12 text-red-500">
        {computersError instanceof Error
          ? computersError.message
          : "Impossible de charger les ordinateurs."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableHeads={[
          <Input type="checkbox" />,
          "N°",
          "Nom",
          "Type",
          "Statut",
          "Utilisateur",
          "Localisation",
          "Fabricant",
          "Action",
        ]}

        toolbar={
          <div
            className="mb-6 flex items-center justify-between gap-4 rounded-[22px] px-5 py-4"
            style={{ backgroundColor: "var(--panel-soft)" }}
          >
            <Input
              placeholder="Rechercher dans la page actuelle..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <Button onClick={() => refetchComputers()}>
              <RefreshCcw size={18} />
              Actualiser
            </Button>
          </div>
        }

        toolbarFooter={
          <div className="col-span-12 mt-4 flex items-center justify-between">
            <p className="text-sm text-(--text-secondary)">
              Page {page + 1} — {total} ordinateur(s) au total
              {isComputersFetching && " — Actualisation..."}
            </p>

            <select name="limitPagination" id="limitPagination"
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
            </select>

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
        }
      >
        {visibleComputers.map((visibleComputer, index) => (
          <tr key={visibleComputer.id}>
            <td className="px-4">
              <Input type="checkbox" />
            </td>
            <td className="px-4 py-3">{page * limit + index + 1}</td>
            <td className="px-4 py-3">{visibleComputer.name}</td>
            <td className="px-4 py-3">{visibleComputer.type?.name ?? "-"}</td>
            <td className="px-4 py-3">{visibleComputer.status?.name ?? "-"}</td>
            <td className="px-4 py-3">{visibleComputer.user?.name ?? "-"}</td>
            <td className="px-4 py-3">
              {visibleComputer.location?.name ?? "-"}
            </td>
            <td className="px-4 py-3">
              {visibleComputer.manufacturer?.name ?? "-"}
            </td>
            <td className="px-4 py-3">
              <Button isWithBackground={false}>Voir</Button>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}