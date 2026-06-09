import { Eye, PenLine, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { Modal } from "../../../../shared/ui/Modal";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { printerFiltersDefaultValues } from "../../../../entities/printer/model/printer.config";
import type { Printer, PrinterFilters } from "../../../../entities/printer/model/printer.types";
import { CreatePrinterForm } from "./CreatePrinterForm";
import { UpdatePrinterForm } from "./UpdatePrinterForm";
import { useDeletePrinter } from "../hooks/useDeletePrinter";
import { usePrintersPage } from "../hooks/usePrinters";

export function ListPrinter() {
  const [filters, setFilters] = useState<PrinterFilters>(printerFiltersDefaultValues);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<number>(20);
  const debouncedFilters = useDebounce(filters, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printerToUpdate, setPrinterToUpdate] = useState<Printer | null>(null);

  const {
    data: printersPage,
    isPending: isPrintersPending,
    isFetching: isPrintersFetching,
    isError: isPrintersError,
    error: printersError,
    refetch: refetchPrinters,
  } = usePrintersPage(page, limit, debouncedFilters);

  const {
    mutateAsync: deletePrinterAsync,
    isPending: isDeletingPrinter,
    error: deletePrinterError,
    isError: isDeletePrinterError,
  } = useDeletePrinter();

  const printers = printersPage?.data ?? [];
  const total = printersPage?.total ?? 0;
  const hasNextPage = (page + 1) * limit < total;

  if (isPrintersPending) {
    return <Loader label="Chargement de la liste des imprimantes" />;
  }

  if (isPrintersError) {
    return (
      <div className="col-span-12 text-red-500">
        {getUserErrorMessage(printersError, "Impossible de charger les imprimantes.")}
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        title="Création Printer"
        onClose={() => setIsModalOpen(false)}
      >
        <CreatePrinterForm
          onClose={() => setIsModalOpen(false)}
          onCreated={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={printerToUpdate !== null}
        title="Modification Printer"
        onClose={() => setPrinterToUpdate(null)}
      >
        {printerToUpdate !== null ? (
          <UpdatePrinterForm
            printer={printerToUpdate}
            onClose={() => setPrinterToUpdate(null)}
            onUpdated={() => setPrinterToUpdate(null)}
          />
        ) : null}
      </Modal>

      {isDeletePrinterError ? (
        <div className="col-span-12 text-red-500">
          {getUserErrorMessage(deletePrinterError, "Impossible de supprimer l’imprimante.")}
        </div>
      ) : null}

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
        toolbar={(
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[22px] px-5 py-4">
            <Button otherClassName="mr-4" onClick={() => setIsModalOpen(true)}>
              Action Groupé
            </Button>

            <Input
              placeholder="Rechercher par nom, numéro de série ou inventaire..."
              value={filters.name}
              onChange={(event) => {
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  name: event.target.value,
                }));
                setPage(0);
              }}
            />

            <Button type="button" onClick={() => refetchPrinters()}>
              <RefreshCcw size={18} />
              Actualiser
            </Button>

            <Button type="button" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Ajouter
            </Button>
          </div>
        )}
        toolbarFooter={(
          <div className="col-span-12 mt-4 flex items-center justify-between">
            <div className="flex gap-3">
              <p className="text-sm text-(--text-secondary)">
                Page {page + 1} — {total} imprimante(s) au total
                {isPrintersFetching ? " — Actualisation..." : ""}
              </p>

              <select
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
              </select>
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
        {printers.map((printer, index) => (
          <tr key={printer.id}>
            <td className="px-4">
              <Input type="checkbox" />
            </td>
            <td className="border border-(--panel-border) px-4 py-4">{page * limit + index + 1}</td>
            <td className="border border-(--panel-border) px-4 py-4">{printer.name}</td>
            <td className="border border-(--panel-border) px-4 py-4">{printer.type?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">{printer.status?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">{printer.user?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">{printer.location?.name ?? "-"}</td>
            <td className="border border-(--panel-border) px-4 py-4">{printer.manufacturer?.name ?? "-"}</td>
            <td className="flex gap-3 px-4 py-3">
              <Button
                aria-label="modification"
                isWithBackground={false}
                otherClassName="bg-blue-500"
                onClick={() => setPrinterToUpdate(printer)}
              >
                <PenLine size={18} />
              </Button>
              <Button
                aria-label="suppression"
                disabled={isDeletingPrinter}
                otherClassName="bg-red-500"
                onClick={async () => {
                  const isConfirmed = confirm(
                    `Voulez-vous vraiment supprimer "${printer.name}" ?`,
                  );

                  if (!isConfirmed) {
                    return;
                  }

                  await deletePrinterAsync(printer.id);
                }}
              >
                <Trash2 size={18} />
              </Button>
              <Button aria-label="Voir le détail" otherClassName="bg-blue-400">
                <Eye size={18} />
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
