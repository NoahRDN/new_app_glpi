import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { DataTable } from "../../../shared/ui/DataTable";
import { Loader } from "../../../shared/ui/Loader";
import { useUsers } from "../hooks/useUsers";
import { Plus, PenLine, Trash2 } from "lucide-react";
import { Modal } from "../../../shared/ui/Modal";
import { UserAdd } from "./UserAdd";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { UserUpdate } from "./UserUpdate";
import { Input } from "../../../shared/ui/Input";


export function UserList(){
    const {users, isLoading, errors, refreshUsers} = useUsers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {errorsDeleteUser, deleteUserHooks, userDelete, setUserDelete, isSuccessDeleteUser, setIsSuccessDeleteUser}= useDeleteUser();
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState<(typeof users)[number] | null>(null);

    return <>
        {isLoading && <Loader label="chargement donnnée user ..." />}
        {!isLoading && errors === "" && 
            <DataTable
                tableClassName="min-w-full"
                tableHead={<thead>
                    <tr className="text-left text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                        <th className="px-4 py-4">
                            <Input type="checkbox" />
                        </th>
                        <th className="px-4 py-4">Id</th>
                        <th className="px-4 py-4">Username</th>
                        <th className="px-4 py-4">realname</th>
                        <th className="px-4 py-4">firstname</th>
                        <th className="px-4 py-4">Action</th>
                    </tr>
                </thead>}
                toolbar={
                    <>
                    <Button
                        otherClassName="mr-4"
                        onClick={() => setIsModalOpen(true)}
                    >Action Groupé</Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                    ><Plus size={20} />Ajouter</Button>
                    <Button
                        otherClassName="ml-4"
                        onClick={() => setIsModalOpen(true)}
                    >Actualiser</Button>
                    </>
                    
                }       
            >
                {/*  */}
                {users.length > 0 && users
                .filter((user) => !user.is_deleted)
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
                            <Button otherClassName="bg-red-500"
                                onClick={
                                     () => {
                                        setIsModalDelete(true);
                                        setUserDelete(user);
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

        {errors !== "" && <span>{errors}</span>}
        {errorsDeleteUser !== "" && <span>{errorsDeleteUser}</span>}

        <Modal
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
                onUserCreated={refreshUsers}
            /> }

            { !isModalDelete && userToUpdate !== null && <UserUpdate
                onClose={() => {
                    setIsModalOpen(false);
                    setUserToUpdate(null);
                }}
                onUserUpdated={refreshUsers}
                userToUpdate={userToUpdate}
            /> }

            {isModalDelete && !isSuccessDeleteUser && 
                <section>
                    <p className="text-center mb-7">Voulez vous vraiment supprimez?</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            otherClassName="bg-red-600 w-full justify-center"
                            onClick={() => {
                                setIsModalDelete(false)
                                setIsModalOpen(false)
                            }} 
                        >Annuler</Button>
                        <Button
                            otherClassName="w-full justify-center"
                            onClick={
                                async () => {
                                    await deleteUserHooks(userDelete.id);
                                    await refreshUsers();
                                }
                            }
                        >Valider</Button>
                    </div>
                </section>
            }

            {isSuccessDeleteUser && 
                <section>
                    <p className="text-center mb-7 text-green-600 bg-green-100 rounded-2xl">"{userDelete.username}" a été bien supprimer</p>
                    <div className="grid grid-cols-1 gap-4">
                        <Button
                            otherClassName="w-full justify-center"
                            onClick={
                                async () => {
                                    setIsSuccessDeleteUser(false)
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
