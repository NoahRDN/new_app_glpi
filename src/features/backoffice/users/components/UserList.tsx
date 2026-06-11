import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { DataTable } from "../../../../shared/ui/DataTable";
import { Loader } from "../../../../shared/ui/Loader";
import { useUsersPage } from "../hooks/useUsers";
import { Plus, PenLine, Trash2 } from "lucide-react";
import { Modal } from "../../../../shared/ui/Modal";
import { UserAdd } from "./UserAdd";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { UserUpdate } from "./UserUpdate";
import { Input } from "../../../../shared/ui/Input";
import { MyError } from "../../../../shared/ui/MyError";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { type User, type UserFilters } from "../../../../entities/user/model/user.types";
import { defaultUserFilter } from "../../../../entities/user/model/user.configs";


export function UserList(){
    const [filters] = useState<UserFilters>({...defaultUserFilter});
    
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState<number>(5);
    const debouncedFilters = useDebounce(filters, 400);

    const {
        data: usersPage,
        isPending: isUsersPending,
        isError: isUsersError,
        error: usersError,
        isFetching: isUsersFetching,
        refetch: refetchUsers
    } = useUsersPage({page: page, limit: limit, filters:debouncedFilters});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        mutateAsync: deleteUserAsync,
        isError: isDeleteUserError,
        error: deleteUserError,
        isPending: isDeleteUserPending,
        isSuccess: isDeleteUserSuccess,
    }= useDeleteUser();

    const [isModalDelete, setIsModalDelete] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState<(typeof users)[number] | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    const users = usersPage?.data ?? [];
    const total = usersPage?.total ?? 0;
    const hasNextPage = (page + 1) * limit < total;

    return <>
        {isUsersPending && <Loader label="chargement donnnée user ..." />}

        {isUsersError && 
            <MyError>
                {getUserErrorMessage(usersError, "Erreur lors du chargements des utilisateur")}
            </MyError>
        }

        {users && 
            <DataTable
                tableClassName="min-w-full"
                tableHeads={[
                    <Input type="checkbox" />,
                    "Id",
                    "Username",
                    "realname",
                    "firstname",
                    "Action",
                ]}
                toolbar={
                    <>
                    <Button
                        className="mr-4"
                        onClick={() => setIsModalOpen(true)}
                    >Action Groupé</Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                    ><Plus size={20} />Ajouter</Button>
                    <Button
                        className="ml-4"
                        onClick={() => setIsModalOpen(true)}
                    >Actualiser</Button>
                    </> 
                }      
                toolbarFooter={(
                    <div className="col-span-12 mt-4 flex items-center justify-between">
                        <div className="flex gap-3">
                        <p className="text-sm text-(--text-secondary)">
                            Page {page + 1} — {total} user(s) au total
                            {isUsersFetching ? " — Actualisation..." : ""}
                        </p>

                        <select
                            id="limitPrinterPagination"
                            name="limitPrinterPagination"
                            value={limit}
                            onChange={(event) => {
                            setLimit(Number(event.target.value));
                            setPage(0);
                            }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
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
                )} 
            >
                {users.length > 0 && users
                .map((user) =>
                    <tr key={user.id} >
                        <td className="px-4">
                            <Input type="checkbox" />
                        </td>
                        <td className="px-4">{user.id}</td>
                        <td className="px-4">{user.username}</td>
                        <td className="px-4">{user.realname}</td>
                        <td className="px-4">{user.firstname}</td>
                        <td className="px-4 flex gap-3 "> 
                            <Button
                                onClick={() => {
                                    setUserToUpdate(user);
                                    setIsModalDelete(false);
                                    setIsModalOpen(true);
                                }}
                            >
                                <PenLine />
                            </Button>
                            <Button className="bg-red-500"
                                onClick={
                                     () => {
                                        setIsModalDelete(true);
                                        setUserToDelete(user);
                                        setUserToUpdate(null);
                                        setIsModalOpen(true);
                                    }
                                }
                            >
                                <Trash2 />
                            </Button>
                        </td>
                    </tr>
                )}    
            </DataTable>   
        }

        
        {isDeleteUserError && 
            <MyError>
                {getUserErrorMessage(deleteUserError, "Erreur lors de la suppression")}
            </MyError>
        }

        <Modal
            isModalColorGreen={isDeleteUserSuccess}
            isOpen={isModalOpen}
            title={`${isModalDelete ? "Supprimer" : userToUpdate !== null ? "Modifier" : "Ajouter"} un utilisateur`}
            onClose={() => {
                setIsModalOpen(false);
                setIsModalDelete(false);
                setUserToUpdate(null);
            }}
        >
            { !isModalDelete && userToUpdate === null && <UserAdd 
                onClose={() => setIsModalOpen(false)}
                onUserCreated={refetchUsers}
            /> }

            { !isModalDelete && userToUpdate !== null && <UserUpdate
                onClose={() => {
                    setIsModalOpen(false);
                    setUserToUpdate(null);
                }}
                onUserUpdated={refetchUsers}
                userToUpdate={userToUpdate}
            /> }

            {isModalDelete && !isDeleteUserSuccess &&
                <section>
                    <p className="text-center mb-7">Voulez vous vraiment supprimez?</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            className="bg-red-600 w-full justify-center"
                            onClick={() => {
                                setIsModalDelete(false)
                                setIsModalOpen(false)
                            }} 
                        >Annuler</Button>
                        <Button
                            className="w-full justify-center"
                            onClick={
                                async () => {
                                    if (!userToDelete) {
                                        return <MyError>Utilisateur Non trouvé</MyError>
                                    }

                                    const userIdToDelete = userToDelete.id;

                                    await deleteUserAsync({userId: userIdToDelete});
                                    await refetchUsers();
                                }
                            }
                        >{isDeleteUserPending ? `Suppression....` : `Valider`}</Button>
                    </div>
                </section>
            }

            {isDeleteUserSuccess && 
                <section>
                    <p className="text-center mb-7 rounded-2xl">"{userToDelete?.username}" a été bien supprimer</p>
                    <div className="grid grid-cols-1 gap-4">
                        <Button
                            className="w-full justify-center"
                            onClick={
                                async () => {
                                    setIsModalOpen(false)
                                }
                            }
                        >Valider</Button>
                    </div>
                </section>
            }
        </Modal>
    </>
}
