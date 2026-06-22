import { Download } from "lucide-react";
import { downloadCsv } from "../../../../shared/lib/csv";
import { getAllGeneralViewAssetItems } from "../api/generalViewAssetItems.api";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { useGeneralViewAssetItemsPage } from "../hooks/useGeneralViewAssetItems";
import { MyError } from "../../../../shared/ui/MyError";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import type { GeneralViewAssetItemsFilters, GeneralViewAssetItems } from "../model/generalViewAssetItems.types";
import {  generalViewAssetItemsFiltersDefaultValues } from "../model/generalViewAssetItems.config";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { useAssets } from "../../../backoffice/assets/hooks/useAssets";
import { Select } from "../../../../shared/ui/Select";
import { AssetImages } from "../../../shared/asset-images/components/AssetImages";

export function ListGeneralViewItem(){
    const [isExportingCsv, setIsExportingCsv] = useState(false);
    const [exportCsvError, setExportCsvError] = useState<unknown>(null);
    const [filters, setFilters] = useState<GeneralViewAssetItemsFilters>({...generalViewAssetItemsFiltersDefaultValues})
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

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

    const csvColumns = [
    {
        header: "Numéro ligne",
        getValue: (_item: GeneralViewAssetItems, index: number) => index + 1,
    },
    {
        header: "Nom",
        getValue: (item: GeneralViewAssetItems) => item.name,
    },
    {
        header: "Type technique",
        getValue: (item: GeneralViewAssetItems) => item.itemType,
    },
    {
        header: "Type affiché",
        getValue: (item: GeneralViewAssetItems) => item.itemTypeLabel,
    },
    {
        header: "Date de création",
        getValue: (item: GeneralViewAssetItems) => item.dateCreation,
    },
    {
        header: "Date de modification",
        getValue: (item: GeneralViewAssetItems) => item.dateMod,
    },
    {
        header: "Entité",
        getValue: (item: GeneralViewAssetItems) => item.entity?.name,
    },
    {
        header: "Récursif",
        getValue: (item: GeneralViewAssetItems) => item.isRecursive ? "Oui" : "Non",
    },
    {
        header: "Fabricant",
        getValue: (item: GeneralViewAssetItems) => item.manufacturer?.name,
    },
    {
        header: "Statut",
        getValue: (item: GeneralViewAssetItems) => item.status?.name,
    },
    {
        header: "Utilisateur",
        getValue: (item: GeneralViewAssetItems) => item.user?.name,
    },
    {
        header: "Technicien",
        getValue: (item: GeneralViewAssetItems) => item.userTech?.name,
    },
    ];

    async function handleExportCsv() {
        try {
            setIsExportingCsv(true);
            setExportCsvError(null);

            const items = await getAllGeneralViewAssetItems(debouncedFilters);

            downloadCsv({
            filename: "inventaire-assets.csv",
            rows: items,
            columns: csvColumns,
            });
        } catch (error) {
            setExportCsvError(error);
        } finally {
            setIsExportingCsv(false);
        }
    }

    // function handleExportCurrentPageCsv() {
    //     downloadCsv({
    //         filename: "inventaire-assets-page-actuelle.csv",
    //         rows: generalViewAssetItems,
    //         columns: csvColumns,
    //     });
    // }

    return <>

        {exportCsvError && (
            <MyError>
                {getUserErrorMessage(
                exportCsvError,
                "Erreur lors de l’export CSV.",
                )}
            </MyError>
        )}
        <DataTable
            tableHeads={[
                <Input type="checkbox" />, 
                "Numéro Ligne",
                "Image",
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
                        placeholder="Recherche nom, type, entite, fabricant, utilisateur, statut..."
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

                    <Input
                        type="date"
                        value={filters.dateCreationFrom ?? ""}
                        onChange={(event) => {
                            setFilters({
                                ...filters,
                                dateCreationFrom: event.target.value,
                            });
                            setPage(0);
                        }}
                    />

                    <Input
                        type="date"
                        value={filters.dateCreationTo ?? ""}
                        onChange={(event) => {
                            setFilters({
                                ...filters,
                                dateCreationTo: event.target.value,
                            });
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
                                setPage(0);
                                setItemTypeFilter(event.target.value);
                                return;
                            }

                            setFilters({
                                ...filters,
                                itemtypes: [event.target.value]
                            })
                            setPage(0);
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
                    <Button
                    type="button"
                    disabled={isExportingCsv}
                    onClick={handleExportCsv}
                    >
                    <Download size={18} />
                    {isExportingCsv ? "Export..." : "Exporter CSV"}
                    </Button>
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
                <td className="border border-(--panel-border) px-4 py-4">
                    <AssetImages
                        itemId={generalViewAssetItem.id}
                        itemtype={generalViewAssetItem.itemType}
                        limit={1}
                        variant="thumbnail"
                    />
                </td>
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
                    <span className="text-sm text-(--text-secondary)">-</span>
                </td>
            </tr>
            ))}

        </DataTable>

        
    
    </>
}
