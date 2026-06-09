import type { ComponentPropsWithoutRef } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { useAddUser } from "../hooks/useAddUser";
import { MyError } from "../../../../shared/ui/MyError";
import { Success } from "../../../../shared/ui/Succcess";

type UserAddProps = {
    onClose: () => void;
    onUserCreated: () => void;
}

type FormSubmitHandler = NonNullable<ComponentPropsWithoutRef<"form">["onSubmit"]>;

export function UserAdd({onClose, onUserCreated} : UserAddProps){
    const {user, setUser, isAdding, addUser, error, isSuccess} = useAddUser();

    const handleSubmit: FormSubmitHandler = async (event) => {
        event.preventDefault();
        
        const createdUser = await addUser();

        if (createdUser) {
            onUserCreated();
            onClose();
        }
    };

    return(<>
    <div className="flex items-center gap-3 flex-col">
        {
            error !== "" && <MyError>{error}</MyError>
        }
        {
            isSuccess && <Success>Utilisateur ajouté avec succès</Success>
        }
        <form className="flex gap-3 flex-col w-full " onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <Label htmlFor="username">Username: </Label>
                <Input type="text" id="username" value={user?.username}
                onChange={(event) =>
                    setUser({
                        ...user,
                        username: event.target.value,
                    })
                }/>
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="firstname">First Name: </Label>
                <Input type="text" id="firstname" value={user?.firstname}
                    onChange={(event) =>
                    setUser({
                        ...user,
                        firstname: event.target.value,
                    })
                    }
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="realname">Real Name: </Label>
                <Input type="text" id="realname" value={user?.realname}
                    onChange={(event) =>
                    setUser({
                        ...user,
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
            <div className="flex gap-3 justify-between">
                <Button
                    otherClassName="w-full flex items-center flex-col" 
                    isWithBackground={false}
                    onClick={onClose}
                >Annuler</Button>  
                <Button 
                    type="submit"
                    otherClassName="w-full flex items-center flex-col" 
                    disabled={isAdding}
                >
                    {isAdding ? "Ajout...." : "Ajouter" }    
                </Button>  
            </div>
        </form>
    </div>
    </>)
}
