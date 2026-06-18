import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { Input } from "../../../../shared/ui/Input";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { reouverturChoice } from "../../super-cost1/lib/traitementScenarioTicket";
import { Select } from "../../../../shared/ui/Select";

type AddSuperCost1Props = {
  onClose: () => void;
  ticket: Ticket | null;
};

export function AddReouverture({ticket, onClose}: AddSuperCost1Props){
    const [cout, setCout] = useState<number>(0);    
    const [error, setError] = useState<unknown>();
    const [isCreatingSuperCost, setIsCreatingSuperCost] = useState<boolean>(false) 
    const [modeReouverture, setModeReouverture] = useState<number>(1)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (ticket !== null) {
            try{
                setIsCreatingSuperCost(true);
                await reouverturChoice({ticket:ticket,cout:cout, modeReouveture: modeReouverture});
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
            <Label htmlFor="superCost">Ajouter une cout ouverture (%)</Label>
            <Input 
                value={cout}
                id="superCost" type="number" 
                onChange={(event) => {
                    setCout(Number(event.target.value));
                }}
            />

            <Label htmlFor="modeReouverture">
                Choisir mode reouverture
            </Label>
            <Select
                value={modeReouverture}
                onChange={(event) => {
                    setModeReouverture(Number(event.target.value))
                }}
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </Select>

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