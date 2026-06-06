import { RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { Button } from "../../../../shared/ui/Button";
import { useComputers } from "../hooks/useComputers";

export function ListComputer(){
    const [search, setSearch] = useState("");

    const {
        data: computers = [],
        isPending,
        isError,
        error,
        refetch,
    } = useComputers();

    const visibleComputers  = useMemo(() => {
        const query = search.trim().toLowerCase();

        return computers.filter((computer) => {
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
    }, [computers, search]);

    if (isPending) {
        return <Loader label="Chargement de la liste des Ordinateurs" />
    }

    if (isError) {
        return (
        <div className="col-span-12 text-red-500">
            {error instanceof Error
            ? error.message
            : "Impossible de charger les ordinateurs."}
        </div>
        );
    }


    return<DataTable
        tableHeads={
            [
                <Input type="checkbox" />,
                "N°",
                "Nom",
                "Type",
                "Statut",
                "Utilisateur",
                "Localisation",
                "Fabricant",
                "Action",
            ]
        }
        toolbar={
            <div className="mb-6 flex items-center justify-between gap-4 rounded-[22px] px-5 py-4" style={{ backgroundColor: "var(--panel-soft)" }}>
                <Input
                    placeholder="Rechercher par nom, numéro de série ou inventaire..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                <Button onClick={() => refetch()}>
                    <RefreshCcw size={18} />
                    Actualiser
                </Button>
            </div>
        }
    >
    
        {visibleComputers && visibleComputers.length > 0 && visibleComputers.map((visibleComputer, index) =>
            <tr key={visibleComputer.id}>
                <td className="px-4">
                    <Input type="checkbox" />
                </td>
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{visibleComputer?.name}</td>
                <td className="px-4 py-3">{visibleComputer?.type?.name}</td>
                <td className="px-4 py-3">{visibleComputer?.status?.name}</td>
                <td className="px-4 py-3">{visibleComputer?.user?.name}</td>
                <td className="px-4 py-3">{visibleComputer?.location?.name}</td>
                <td className="px-4 py-3">{visibleComputer?.manufacturer?.name}</td>
                <td className="px-4 py-3">
                    <Button isWithBackground={false}>Voir</Button>
                </td>
            </tr>
        )}

    </DataTable>
}
