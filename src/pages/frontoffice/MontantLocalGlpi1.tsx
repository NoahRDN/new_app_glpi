import { useSuperCost1GroupByCategorieTypeCout } from "../../features/frontoffice/super-cost1/hooks/useSuperCost1GroupByCategorie";
import { useSuperCost1GroupByCategorieTypeCoutLastMax } from "../../features/frontoffice/super-cost1/hooks/useSuperCost1GroupByCategorieLastMax";
import { DataTable } from "../../shared/ui/DataTable";

export function MontantLocalGlpi1(){

    const {
        data: superCost1GroupByCategorieTypeCout
    }=  useSuperCost1GroupByCategorieTypeCout()

    const {
        data: superCost1GroupByCategorieTypeCoutLastMax
    }=  useSuperCost1GroupByCategorieTypeCoutLastMax()


    const categories : string[] = [];
    
    if (superCost1GroupByCategorieTypeCout) {
        superCost1GroupByCategorieTypeCout.map((superCost1) => {
            if (!categories.includes(superCost1.category)) {
                categories.push(superCost1.category);
                return
            }
        })
    }

    return <div className="p-5 bg-white col-span-12">
        <DataTable 
            tableHeads={[
                "categorie item",
                "Total GLPI",
                "Total Super Cout",
                "total Reouverture", 
                "Total"
            ]}
        >
            
            {superCost1GroupByCategorieTypeCout && categories && superCost1GroupByCategorieTypeCoutLastMax &&
                categories.map((category) => {
                    let glpi = 0;
                    let cout_saisi = 0;
                    let reouverture = 0;

                    superCost1GroupByCategorieTypeCoutLastMax.map((superCost1) => {
                        if (superCost1.category !== category) {
                            return
                        }
                        if (superCost1.type_cout === "glpi") {
                            glpi = superCost1.cout + glpi;
                        }
                    })

                    superCost1GroupByCategorieTypeCout.map((superCost1) => {
                        if (superCost1.category !== category) {
                            return
                        }
                        if (superCost1.type_cout === "glpi") {
                            glpi = superCost1.cout + glpi;
                        }
                        if (superCost1.type_cout === "cout_saisi") {
                            cout_saisi = superCost1.cout + cout_saisi;
                        }
                        if (superCost1.type_cout === "reouverture") {
                            reouverture = superCost1.cout + reouverture;
                        }
                    })
                    const total = glpi + cout_saisi + reouverture 
                    return (
                        <tr key={category}>
                            <td className="border border-(--panel-border) px-4 py-4">{category}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{glpi}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{cout_saisi}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{reouverture}</td>
                            <td className="border border-(--panel-border) px-4 py-4">{total}</td>
                        </tr>
                    )
                })
            }
        </DataTable>
    </div>
}
