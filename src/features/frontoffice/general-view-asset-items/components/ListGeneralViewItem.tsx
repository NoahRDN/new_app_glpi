import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { Loader } from "../../../../shared/ui/Loader";
import { useGeneralViewAssetItems } from "../hooks/useGeneralViewAssetItems";
import { Error } from "../../../../shared/ui/Error";
import { RefreshCcw } from "lucide-react";

export function ListGeneralViewItem(){
    const {
        data: generalViewAssetItems,
        isPending: isGeneralViewAssetItemsPending,
        isFetching: isGeneralViewAssetItemsFetching,
        isError: isGeneralViewAssetItemsError,
        error: generalViewAssetItemsError,
        refetch: refetchGeneralViewAssetItems,
    } = useGeneralViewAssetItems();
    if (isGeneralViewAssetItemsPending || isGeneralViewAssetItemsFetching) {
        return <Loader label="Chargement des Items..." />
    }

    if (isGeneralViewAssetItemsError) {
        return <div>
            <Error>
                {getUserErrorMessage(generalViewAssetItemsError, "Erreur lors du chargement des Items")}
            </Error>
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
                <Button
                    onClick={() => refetchGeneralViewAssetItems()}
                ><RefreshCcw size={18} />Actualiser</Button>
            }
        >
        { generalViewAssetItems && generalViewAssetItems.length > 0  && 
            generalViewAssetItems.map((generalViewAssetItem, index) => 
                <tr key={index}>
                    <td className="px-4">
                        <Input type="checkbox" />
                    </td>
                    <td className="px-4">{index + 1}</td>
                    <td className="px-4">{generalViewAssetItem?.name}</td>
                    <td className="px-4">{generalViewAssetItem?.itemType}</td>
                    <td className="px-4">{generalViewAssetItem?.dateCreation}</td>
                    <td className="px-4">{generalViewAssetItem?.dateMod}</td>
                    <td className="px-4">{generalViewAssetItem?.entity?.name}</td>
                    <td className="px-4">{generalViewAssetItem?.isRecursive ? "Oui" : "Non"}</td>
                    <td className="px-4">{generalViewAssetItem?.manufacturer?.name}</td>
                    <td className="px-4">{generalViewAssetItem?.status?.name}</td>
                    <td className="px-4">{generalViewAssetItem?.user?.name}</td>
                    <td className="px-4">{generalViewAssetItem?.userTech?.name}</td>
                    <td className="px-4">
                        <Button>Détails</Button>
                    </td>
                </tr>
            )
        }

        </DataTable>
    
    </>
}
