import { useMemo, useState } from "react";
import { useAssets } from "../../features/backoffice/assets/hooks/useAssets";
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import { DataTable } from "../../shared/ui/DataTable";

export function AssetsPage() {
    const [search, setSearch] = useState("");

    const { data: assets = [], isPending, isError, error, refetch } = useAssets();

    const visibleAssets = useMemo(() => {
        const query = search.trim().toLowerCase();

        return assets.filter((asset) => {
            if (query.length === 0) {
                return true;
            }

            return asset.name?.toLowerCase().includes(query);
        });
    }, [assets, search]);

    if (isPending) {
        return <div className="col-span-12">Chargement des assets...</div>;
    }

    if (isError) {
        return (
            <div className="col-span-12 text-red-500">
                {error instanceof Error
                    ? error.message
                    : "Impossible de charger les assets."}
            </div>
        );
    }

    return (
        <div className="col-span-12">
            <div className="flex gap-3 pb-5">
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un asset..."
                />

                <Button onClick={() => refetch()}>Rafraîchir</Button>
            </div>

            <DataTable 
                tableHeads={[
                    "Nom",
                    "Lien",
                    "Type Element",
                ]}
            >
                {visibleAssets.map((asset) => (
                    <tr key={asset.name}>
                        <td className="py-2 px-4">{asset.name}</td>
                        <td className="py-2 px-4">{asset.href}</td>
                        <td className="py-2 px-4">{asset.itemtype}</td>
                    </tr>
                ))}
            </DataTable>
                
                

                
        </div>
    );
}
