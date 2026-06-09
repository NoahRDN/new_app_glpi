import {  Eye, PenLine, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { Button } from "../../../../shared/ui/Button";
import { useComputersPage } from "../hooks/useComputers";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import type { Computer, ComputerFilters } from "../../../../entities/computer/model/computer.types";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { computerFiltersDefaultValues } from "../../../../entities/computer/model/computer.config";
import { CreateComputerForm } from "./CreateComputerForm";
import { Modal } from "../../../../shared/ui/Modal";
import { UpdateComputerForm } from "./UpdateComputerForm";
import { useDeleteComputer } from "../hooks/useDeleteComputer";

export function ListComputer() {
  const [filters, setFilters] = useState<ComputerFilters>(computerFiltersDefaultValues);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<number>(20);
  const debouncedFilters = useDebounce(filters, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [computerToUpdate, setComputerToUpdate] = useState<Computer | null>(null);

  const {
    data: computersPage,
    isPending: isComputersPending,
    isFetching: isComputersFetching,
    isError: isComputersError,
    error: computersError,
    refetch: refetchComputers,
  } = useComputersPage(page, limit, debouncedFilters);

  const {
    mutateAsync: deleteComputerAsync,
    isPending: isDeletingComputer,
    error: deleteComputerError,
    isError: isDeleteComputerError,
  } = useDeleteComputer();

  const computers = computersPage?.data ?? [];
  const total = computersPage?.total ?? 0;
  const hasNextPage = (page + 1) * limit < total;

  if (isComputersPending) {
    return <Loader label="Chargement de la liste des ordinateurs" />;
  }

  if (isComputersError) {
    return (
      <div className="col-span-12 text-red-500">
        {getUserErrorMessage(computersError, "Impossible de charger les ordinateurs.")}
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        title="Création Computer"
        onClose={() => {
            setIsModalOpen(false)
        }}
      >
        <CreateComputerForm 
          onClose={() => setIsModalOpen(false)}
          onCreated={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={computerToUpdate !== null}
        title="Modification Computer"
        onClose={() => {
          setComputerToUpdate(null);
        }}
      >
        {computerToUpdate !== null && (
          <UpdateComputerForm
            computer={computerToUpdate}
            onClose={() => {
              setComputerToUpdate(null);
            }}
            onUpdated={() => {
              setComputerToUpdate(null);
            }}
          />
        )}
      </Modal>

      {isDeleteComputerError && (
        <div className="col-span-12 text-red-500">
          {getUserErrorMessage(
            deleteComputerError,
            "Impossible de supprimer l’ordinateur.",
          )}
        </div>
      )}

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
          >
            <Button
                className="mr-4"
                onClick={() => setIsModalOpen(true)}
            >Action Groupé</Button>
            <Input
              placeholder="Rechercher dans la page actuelle..."
              value={filters?.name}
              onChange={(event) => {
                setFilters((currentFilters) => {
                  return {
                    ...currentFilters,
                    name: event.target.value
                  }
                });
                setPage(0);
              }}
            />

            <Button type="button" onClick={() => refetchComputers()}>
              <RefreshCcw size={18} />
              Actualiser
            </Button>
            <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
            ><Plus size={20} />Ajouter</Button>
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
              <option value="200">200</option>
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
        {computers.map((visibleComputer, index) => (
          <tr key={visibleComputer.id}>
            <td className="px-4">
              <Input type="checkbox" />
            </td>
            <td className="border border-(--panel-border) px-4 py-4">{page * limit + index + 1}</td>
            <td className="border border-(--panel-border) px-4 py-4">{visibleComputer.name}</td>
            <td className="border border-(--panel-border) px-4 py-4">{visibleComputer.type?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">{visibleComputer.status?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">{visibleComputer.user?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">
              {visibleComputer.location?.name ?? "-"}
            </td>
            <td className="border border-(--panel-border) px-4 py-4">
              {visibleComputer.manufacturer?.name ?? "-"}
            </td>
            <td className="px-4 py-3 flex gap-3">
              <Button
                className="bg-blue-500"
                isWithBackground={false}
                aria-label="modification"
                onClick={() => {
                  setComputerToUpdate(visibleComputer);
                }}
              >
                <PenLine size={18} />
              </Button>
              <Button 
                className="bg-red-500"
                disabled={isDeletingComputer}
                aria-label="suppression"
                onClick={async () => {
                  const isConfirmed = confirm(
                    `Voulez-vous vraiment supprimer "${visibleComputer.name}" ?`,
                  );

                  if (!isConfirmed) {
                    return;
                  }

                  await deleteComputerAsync(visibleComputer.id);
                }}
              ><Trash2 size={18} /></Button>
              <Button className="bg-blue-400" aria-label="Voir le détail"><Eye size={18} /></Button>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}