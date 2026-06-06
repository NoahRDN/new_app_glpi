import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Input } from "../../../../shared/ui/Input";
import { generalViewAssetItemsMock } from "../model/generalViewAssetItems.mock";

export function ListGeneralViewItem(){
    
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
        >
        { generalViewAssetItemsMock && generalViewAssetItemsMock.length > 0  && 
            generalViewAssetItemsMock.map((generalViewAssetItemMock, index) => <>
                <tr key={index}>
                    <td className="px-4">
                        <Input type="checkbox" />
                    </td>
                    <td className="px-4">{index + 1}</td>
                    <td className="px-4">{generalViewAssetItemMock.name}</td>
                    <td className="px-4">{generalViewAssetItemMock.assetType}</td>
                    <td className="px-4">{generalViewAssetItemMock.dateCreation}</td>
                    <td className="px-4">{generalViewAssetItemMock.dateMod}</td>
                    <td className="px-4">{generalViewAssetItemMock.entity.name}</td>
                    <td className="px-4">{generalViewAssetItemMock.isRecursive ? "Oui" : "Non"}</td>
                    <td className="px-4">{generalViewAssetItemMock.manufacturer.name}</td>
                    <td className="px-4">{generalViewAssetItemMock.status.name}</td>
                    <td className="px-4">{generalViewAssetItemMock.user.name}</td>
                    <td className="px-4">{generalViewAssetItemMock.userTech.name}</td>
                    <td className="px-4">
                        <Button>Détails</Button>
                    </td>
                </tr>
            </>)
        }

        </DataTable>
    
    </>
}
