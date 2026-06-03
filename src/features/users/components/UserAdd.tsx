import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";

export function UserAdd(){
    return(<>
    <div className="flex items-center gap-3 flex-col">
        <h1>Création Utilisateur</h1>
        <form className="flex gap-3 flex-col" action="">
            <div className="flex flex-col gap-1">
                <label htmlFor="username">Username: </label>
                <Input type="text" id="username" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="firstname">First Name: </label>
                <Input type="text" id="firstname"/>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="email">Email: </label>
                <Input type="email" id="email" />
            </div>
            <div className="flex justify-between">
                <Button isWithBackground={false}>Annuler</Button>  
                <Button>Ajouter</Button>  
            </div>
        </form>
    </div>
    </>)
}