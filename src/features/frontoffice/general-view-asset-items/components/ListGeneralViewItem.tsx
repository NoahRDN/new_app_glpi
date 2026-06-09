import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { useGeneralViewAssetItemsPage } from "../hooks/useGeneralViewAssetItems";
import { MyError } from "../../../../shared/ui/MyError";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import type { GeneralViewAssetItemsFilters } from "../model/generalViewAssetItems.types";
import {  generalViewAssetItemsFiltersDefaultValues } from "../model/generalViewAssetItems.config";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { useAssets } from "../../../backoffice/assets/hooks/useAssets";
import { Select } from "../../../../shared/ui/Select";

export function ListGeneralViewItem(){
    const [filters, setFilters] = useState<GeneralViewAssetItemsFilters>({...generalViewAssetItemsFiltersDefaultValues})
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(20);

    const debouncedFilters = useDebounce(filters, 400);

    const {
        data: generalViewAssetItemsPage,
        isPending: isGeneralViewAssetItemsPending,
        isFetching: isGeneralViewAssetItemsFetching,
        isError: isGeneralViewAssetItemsError,
        error: generalViewAssetItemsError,
        refetch: refetchGeneralViewAssetItems,                  
    } = useGeneralViewAssetItemsPage(page, limit, debouncedFilters);

    const {
        data: assetsData,
        isPending: isAssetsPending,
        isError: isAssetsError,
        error: assetsError,
        refetch: refetchAssets,
    } = useAssets();

    const [itemTypeFilter, setItemTypeFilter] = useState<string>("")


    const generalViewAssetItems = generalViewAssetItemsPage?.data ?? [];
    const total = generalViewAssetItemsPage?.total ?? 0;
    const hasNextPage = (page + 1) * limit < total;

    if (isGeneralViewAssetItemsPending) {
        return <Loader label="Chargement des Items..." />
    }

    if (isGeneralViewAssetItemsError) {
        return <div>
            <MyError>
                {getUserErrorMessage(generalViewAssetItemsError, "Erreur lors du chargement des Items")}
            </MyError>
        </div>
    }

    if (isAssetsPending) {
        return <Loader label="Chargement des Assets..." />
    }

    if (isAssetsError) {
        return <div>
            <MyError>
                {getUserErrorMessage(assetsError, "Erreur lors du chargement des Assets")}
            </MyError>
        </div>
    }

    return <>
        <DataTable
            tableHeads={[
                <Input type="checkbox" />, 
                "Numéro Ligne",
                "Nom",
                "Type",
                "Date de création",
                "Date de modification",
                "Entité",
                "Récursif",
                "Fabricant",
                "Statut",
                "Utilisateur",
                "Technicien",
                "Action"
            ]}

            toolbar={
                <div className="flex gap-3">
                    <Input 
                        placeholder="Rercherche nom...."
                        type="text" 
                        value={filters.name}
                        onChange={(event) => {
                            setFilters({
                                ...filters,
                                name: event.target.value
                            })
                            setPage(0);
                        }}
                    />

                    <Select  
                        value={itemTypeFilter}
                        onChange={(event) => {
                            if (event.target.value === "") {
                                setFilters({
                                    ...filters,
                                    itemtypes: []
                                })
                                setItemTypeFilter(event.target.value);
                                return;
                            }

                            setFilters({
                                ...filters,
                                itemtypes: [event.target.value]
                            })
                            setItemTypeFilter(event.target.value);
                        }}
                        name="filterTypeItem" id="filterTypeItem"
                    >
                        <option value="">Type Items</option>
                        {assetsData && assetsData.length > 0 &&
                            assetsData.map((asset) => <option key={asset.itemtype} value={asset.itemtype}>{asset.name}</option>)
                        }
                    </Select>
                    <Button
                        onClick={() => {
                            refetchGeneralViewAssetItems()
                            refetchAssets()
                        }}
                    ><RefreshCcw size={18} />Actualiser</Button>
                </div>
            }

            toolbarFooter={
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    <p className="text-sm text-(--text-secondary)">
                        Page {page + 1} — {total} item(s) au total
                        {isGeneralViewAssetItemsFetching && " — Actualisation..."}
                    </p>

                    <select
                        value={limit}
                        onChange={(event) => {
                            setLimit(Number(event.target.value));
                            setPage(0);
                        }}
                    >
                        
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
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
            }
        >
        {generalViewAssetItems.map((generalViewAssetItem, index) => (
            <tr key={`${generalViewAssetItem.itemType}-${generalViewAssetItem.name}-${page}-${index}`}>
                <td className="border border-(--panel-border) px-4 py-4">
                    <Input type="checkbox" />
                </td>
                <td className="border border-(--panel-border) px-4 py-4">{page * limit + index + 1}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.name}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.itemType}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.dateCreation}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.dateMod}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.entity?.name}</td>
                <td className="border border-(--panel-border) px-4 py-4">
                {generalViewAssetItem?.isRecursive ? "Oui" : "Non"}
                </td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.manufacturer?.name}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.status?.name}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.user?.name}</td>
                <td className="border border-(--panel-border) px-4 py-4">{generalViewAssetItem?.userTech?.name}</td>
                <td className="border border-(--panel-border) px-4 py-4">
                    <Button>Détails</Button>
                </td>
            </tr>
            ))}

        </DataTable>

        
    
    </>
}
