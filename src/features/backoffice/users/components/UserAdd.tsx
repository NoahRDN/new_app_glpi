import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { useAddUser } from "../hooks/useAddUser";
import { MyError } from "../../../../shared/ui/MyError";
import { Success } from "../../../../shared/ui/Succcess";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import type { CreateUser } from "../../../../entities/user/model/user.types";
import { defaultCreateUser } from "../../../../entities/user/model/user.configs";

type UserAddProps = {
    onClose: () => void;
}

export function UserAdd({onClose} : UserAddProps){
    const [form, setForm] = useState<CreateUser>(defaultCreateUser);

    const {
        mutateAsync: createUserAsync,
        isPending: isCreatingUser,
        isError: isCreateUserError,
        error: createUserError,
        isSuccess: isCreateUserSuccess,
    } = useAddUser();
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await createUserAsync(form);
    }

    return(<>
    <div className="flex items-center gap-3 flex-col">
        {
            isCreateUserError && 
            <MyError className="bg-transparent">{getUserErrorMessage(createUserError, "Erreur lors de la création d'utilisateur")}</MyError>
        }
        {
            isCreateUserSuccess && 
            <Success>Utilisateur ajouté avec succès</Success>
        }
        <form className="flex gap-3 flex-col w-full " onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <Label htmlFor="username">Username: </Label>
                <Input type="text" id="username" value={form.username}
                onChange={(event) =>
                    setForm({
                        ...form,
                        username: event.target.value,
                    })
                }/>
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="firstname">First Name: </Label>
                <Input type="text" id="firstname" value={form.firstname}
                    onChange={(event) =>
                    setForm({
                        ...form,
                        firstname: event.target.value,
                    })
                    }
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="realname">Real Name: </Label>
                <Input type="text" id="realname" value={form.realname}
                    onChange={(event) =>
                    setForm({
                        ...form,
                        realname: event.target.value,
                    })
                    }
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email: </Label>
                <Input type="email" id="email" 
                />
            </div>
            {!isCreateUserSuccess && 
                <div className="flex gap-3 justify-between">
                    <Button
                        type="button"
                        className="w-full flex items-center flex-col" 
                        isWithBackground={false}
                        onClick={onClose}
                    >Annuler</Button>  
                    <Button 
                        type="submit"
                        className="w-full flex items-center flex-col" 
                        disabled={isCreatingUser}
                    >
                        {isCreatingUser ? "Ajout...." : "Ajouter" }    
                    </Button>  
                </div>
            }

            {isCreateUserSuccess && 
                <Button 
                    type="submit"
                    className="w-full flex items-center flex-col" 
                    onClick={onClose}
                >
                    Valider    
                </Button>
            }
        </form>
    </div>
    </>)
}
