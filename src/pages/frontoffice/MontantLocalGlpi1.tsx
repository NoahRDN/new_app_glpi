import { DataTable } from "../../shared/ui/DataTable";

export function MontantLocalGlpi1(){
  
    return <div className="p-5 bg-white col-span-12">
        <DataTable 
            tableHeads={[
                "categorie item",
                "Total GLPI",
                "Total Super Cout",
                "total Reouverture", 
            ]}
        >
            <tr>
                <td className="border border-(--panel-border) px-4 py-4">Computer</td>
                <td className="border border-(--panel-border) px-4 py-4">1</td>
                <td className="border border-(--panel-border) px-4 py-4">1</td>
                <td className="border border-(--panel-border) px-4 py-4">1</td>
            </tr>
        </DataTable>
    </div>
}
