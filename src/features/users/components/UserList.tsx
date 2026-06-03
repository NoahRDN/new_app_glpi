import { DataTable } from "../../../shared/ui/DataTable";
import { useUsers } from "../hooks/useUsers";


export function UserList(){
    useUsers();

    return <>
        <DataTable
            tableClassName="min-w-full"
            tableHead={<thead>
                <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                    <th className="px-4 py-4">Id</th>
                    <th className="px-4 py-4">Username</th>
                    <th className="px-4 py-4">realname</th>
                    <th className="px-4 py-4">firstname</th>
                </tr>
            </thead>}       
        >
            <tr>
                <td className="px-4 py-4">1</td>
                <td className="px-4 py-4">admin</td>
                <td className="px-4 py-4">Doe</td>
                <td className="px-4 py-4">John</td>
            </tr>             
        </DataTable>    
    </>
}
