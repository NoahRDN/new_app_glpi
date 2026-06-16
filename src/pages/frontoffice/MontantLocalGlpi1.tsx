import { useState } from "react";
import { useSuperCost1 } from "../../features/frontoffice/super-cost1/hooks/useSuperCost1";
import { useSuperCost1GroupByCategorieTypeCout } from "../../features/frontoffice/super-cost1/hooks/useSuperCost1GroupByCategorie";
import { Button } from "../../shared/ui/Button";
import { DataTable } from "../../shared/ui/DataTable";

export function MontantLocalGlpi1(){
    const [categorieItemDetail, setCategorieItemDetail] = useState<string>("");

    const {
        data: superCost1GroupByCategorieTypeCout
    }=  useSuperCost1GroupByCategorieTypeCout()

    const {
            data: superCostsData
    } = useSuperCost1();

    const superCostsDetail = superCostsData?.filter(
        (superCostData) => superCostData.category === categorieItemDetail
    ) ?? [];


    const superCostsDetailUnique = superCostsDetail.filter((superCostDetail, index, array) => {
        return index === array.findIndex((item) =>
            item.category === superCostDetail.category &&
            item.id_item === superCostDetail.id_item &&
            item.id_ticket === superCostDetail.id_ticket
        );
    });

    if (superCostsDetail.length > 0) {
        console.log('superCostsDetail: ', superCostsDetail)
        console.log('superCostsDetailUnique: ', superCostsDetailUnique)
    }
    
    const categories : string[] = [];
    
    if (superCost1GroupByCategorieTypeCout) {
        superCost1GroupByCategorieTypeCout.map((superCost1) => {
            if (!categories.includes(superCost1.category)) {
                categories.push(superCost1.category);
                return
            }
        })
        console.log("superCost1GroupByCategorieTypeCout: ", superCost1GroupByCategorieTypeCout);
    }

    return <div className="p-5 bg-white col-span-12">
        <DataTable 
            tableHeads={[
                "categorie item",
                "nombre ticket",
                "nombre item",
                "Total GLPI",
                "Total Super Cout",
                "total Reouverture", 
                "Total",
                "Action"
            ]}
        >
            
            {superCostsData && superCost1GroupByCategorieTypeCout && categories &&
                categories.map((category) => {
                    let glpi = 0;
                    let cout_saisi = 0;
                    let reouverture = 0;
                    const itemsCategory : number[] = [];
                    const ticketsCategory : string[] = [];
                    superCost1GroupByCategorieTypeCout.map((superCost1) => {
                        if (superCost1.category !== category) {
                            return
                        }
                        if (superCost1.type_cout === "glpi") {
                            glpi = glpi + superCost1.cout;
                        }
                    })

                    superCost1GroupByCategorieTypeCout.map((superCost1) => {
                        if (superCost1.category !== category) {
                            return
                        }
                        if (superCost1.type_cout === "cout_saisi") {
                            cout_saisi = superCost1.cout + cout_saisi;
                        }
                        if (superCost1.type_cout === "reouverture") {
                            reouverture = superCost1.cout + reouverture;
                        }
                    })
                    superCostsData.map((superCostData) => {
                        if (superCostData.category === category && !itemsCategory.includes(superCostData.id_item)) {
                            itemsCategory.push(superCostData.id_item);
                        }
                    })

                    superCostsData.map((superCostData) => {
                        if (superCostData.category === category && !ticketsCategory.includes(superCostData.id_ticket)) {
                            ticketsCategory.push(superCostData.id_ticket);
                        }
                    })
                    const total = glpi + cout_saisi + reouverture 
                    return (
                        <tr key={category}>
                            <td className="border border-(--panel-border) px-4 py-4">{category}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{ticketsCategory.length}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{itemsCategory.length}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{glpi}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{cout_saisi}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{reouverture}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{total}</td>
                            <td className="border border-(--panel-border) px-4 py-4">
                                <Button
                                    onClick={() => {
                                        setCategorieItemDetail(category)
                                    }}
                                >Détail</Button>
                            </td>
                        </tr>
                    )
                })
            }
        </DataTable>
        {superCostsDetailUnique.length > 0 && (
            <DataTable 
                className="mt-5"
                tableHeads={[
                    "id",
                    "categorie item",
                    "id ticket",
                    "Id Item",
                    "Cout GLPI", 
                    "Cout Super Cost",
                    "Cout Reouverture", 
                    "Total", 
                ]}
            >
                {superCostsDetailUnique.map((superCostDetail) => {
                    let coutGlpi = 0;
                    superCostsDetail.find((superCost) => {
                        if (
                            superCost.id_item === superCostDetail.id_item &&
                            superCost.type_cout === "glpi" &&
                            superCost.category === superCostDetail.category &&
                            superCost.id_ticket === superCostDetail.id_ticket 
                        ){
                            coutGlpi = coutGlpi + superCost.cout;
                        }
                    });

                    let coutReouverture = 0
                    superCostsDetail.map((superCost) => {
                        if (
                            superCost.id_item === superCostDetail.id_item &&
                            superCost.type_cout === "reouverture" &&
                            superCost.category === superCostDetail.category &&
                            superCost.id_ticket === superCostDetail.id_ticket 
                        ){
                            coutReouverture = coutReouverture + superCost.cout
                        }
                    });

                    let coutSuperCost = 0;
                    superCostsDetail.map((superCost) => {
                        if (
                            superCost.id_item === superCostDetail.id_item &&
                            superCost.type_cout === "cout_saisi" &&
                            superCost.category === superCostDetail.category &&
                            superCost.id_ticket === superCostDetail.id_ticket 
                        ){
                            coutSuperCost = coutSuperCost + superCost.cout
                        }
                    })

                    return (
                        <tr key={`${superCostDetail.category}-${superCostDetail.id_item}-${superCostDetail.id_ticket}-${superCostDetail.group_super_cost_1}`}>
                            <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.id}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.category}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.id_ticket}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{superCostDetail.id_item}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{coutGlpi}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{coutSuperCost}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{coutReouverture}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{coutGlpi + coutSuperCost + coutReouverture}</td>
                        </tr>
                    );
                })}
            </DataTable>
        )}
    </div>
}
