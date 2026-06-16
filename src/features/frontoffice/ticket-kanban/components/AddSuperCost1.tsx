import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { Input } from "../../../../shared/ui/Input";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { closeChoice } from "../../super-cost1/lib/traitementScenarioTicket";


type AddSuperCost1Props = {
  onClose: () => void;
  ticket: Ticket | null;
};

export function AddSuperCost1({ticket, onClose}: AddSuperCost1Props){
    const [error, setError] = useState<unknown>()
    const [cout, setCout] = useState<number>(0)
    const [isCreatingSuperCost, setIsCreatingSuperCost] = useState<boolean>(false) 

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        if (ticket !== null) {
            try {
                setIsCreatingSuperCost(true);
                await closeChoice({ticket: ticket, cout: cout})
                setIsCreatingSuperCost(false);
            } catch (error) {
                setIsCreatingSuperCost(false);
                setError(error)
            }
        } else{
            throw new Error("Aucun donné à créer reçu")
        }
        
        onClose()
    }

    if (error) {
        return <div className="col-span-12 text-red-500">
            {getUserErrorMessage(error, "Erreur lors de la création de userCost")}
        </div>
    }
    
    return <>
    <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
            <Label htmlFor="superCost">Ajouter une super superCost</Label>
            <Input 
                value={cout}
                id="superCost" type="number" 
                onChange={(event) => {
                    setCout(cout)
                    setCout(Number(event.target.value));
                }}
            />

            <div className="flex gap-3">
                    <Button
                        type="button"
                        isWithBackground={false}
                        className="w-full flex items-center flex-col"
                        onClick={onClose}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" className="w-full flex items-center flex-col">
                        {isCreatingSuperCost ? 'creation userCost' : 'Ajouter'}
                    </Button>
                </div>
        </form>
    </>
}