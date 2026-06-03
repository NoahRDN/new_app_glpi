import { DataTable } from "../../../shared/ui/DataTable";
import { Loader } from "../../../shared/ui/Loader";
import { useUsers } from "../hooks/useUsers";


export function UserList(){
    const {users, isLoading, errors} = useUsers();

    return <>

        {isLoading && <Loader label="chargement donnnée user" />}
        {!isLoading && errors === "" && 
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
                {users.length > 0 && users.map((user) =>
                    <tr key={user.id} >
                        <td className="px-4 py-4">{user.id}</td>
                        <td className="px-4 py-4">{user.username}</td>
                        <td className="px-4 py-4">{user.realname}</td>
                        <td className="px-4 py-4">{user.firstname}</td>
                    </tr>  
                )}
            </DataTable>   
        }

        {
            errors !== "" && <span>{errors}</span>
        }
    </>
}
