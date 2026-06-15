import { useState } from "react";
import { useSuperCostGroupByCategorie } from "../../features/frontoffice/super-cost/hooks/useSuperCostGroupByCategorie";
import { useSuperCost } from "../../features/frontoffice/super-cost/hooks/useSuperCost";
import { Button } from "../../shared/ui/Button";
import { DataTable } from "../../shared/ui/DataTable";
import type { SuperCost } from "../../features/frontoffice/super-cost/model/ticketSuperCost.types";
export function MontantLocalGlpi(){
    const [categorieItemDetail, setCategorieItemDetail] = useState<string>("");

    const {
        data: ticketCostsCustomData
    } = useSuperCostGroupByCategorie();

    const {
        data: superCostsData
    } = useSuperCost();

    let superCostsDetail : SuperCost[] = [];
    if (superCostsData) {
        superCostsDetail =  superCostsData.filter((superCostData) => {
            if (superCostData.category === categorieItemDetail) {
                return superCostData;
            }
        });
    }

    return <div className="p-5 bg-white col-span-12">
        <DataTable 
            tableHeads={[
                "categorie item",
                "Nombre Assets",
                "prix fixe import", 
                "prix fixe loca-data",
                "total",
                "Action"
            ]}
        >
            {ticketCostsCustomData && ticketCostsCustomData.map((ticketCostCustomData) => {
                return <tr key={ticketCostCustomData.category}>
                    <td className="border border-(--panel-border) px-4 py-4">{ticketCostCustomData.category}</td>
                    <td className="border border-(--panel-border) px-4 py-4">{ticketCostCustomData.nombre_asset}</td>
                    <td className="border border-(--panel-border) px-4 py-4">{ticketCostCustomData.cout_glpi}</td>
                    <td className="border border-(--panel-border) px-4 py-4">{ticketCostCustomData.cout_saisi}</td>
                    <td className="border border-(--panel-border) px-4 py-4">{ticketCostCustomData.total}</td>
                    <td className="border border-(--panel-border) px-4 py-4">
                        <Button
                            onClick={
                                () => {
                                    setCategorieItemDetail(ticketCostCustomData.category)
                                }
                            }
                        >
                            Détail
                        </Button>
                    </td>
                </tr>
            })} 
        </DataTable>

        <h3 className="mt-5">Détails</h3>

        {superCostsDetail && superCostsDetail.length > 0 && 
            <DataTable 
                tableHeads={[
                    "categorie item",
                    "Id Item",
                    "Cout GLPI", 
                    "prix saisie",
                    "id ticket",
                ]}
            >
                {superCostsDetail.map((superCostDetail) => {
                    return <tr key={`${superCostDetail.id_ticket}-${superCostDetail.id_item}`}>
                        <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.category}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.id_item}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.cout_glpi}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.cout_saisi}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.id_ticket}</td>
                    </tr>
                })}
            </DataTable>
        }
    </div>

}
