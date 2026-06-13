import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { Input } from "../../../../shared/ui/Input";
import { useCreateSuperCost } from "../hooks/useCreateSuperCost";
import type { CreateSuperCost } from "../model/superCost.types";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";

type AddSuperCostProps = {
  onClose: () => void;
  id_ticket: string;
};

export function AddSuperCost({id_ticket, onClose}: AddSuperCostProps){
    const [formSupercost, setFormSupercost] = useState<CreateSuperCost>({
        montant: "-1",
        id_ticket: `${id_ticket}`
    });
    const [montant, setMontant] = useState<number>(0);

    const {
        mutateAsync: createSuperCostAsync,
        isPending: isCreatingSuperCost,
        isError: isCreateSuperCostError,
        error: createSuperCostError,
    } = useCreateSuperCost();    

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(formSupercost);
        await createSuperCostAsync(formSupercost)
        onClose()
    }

    
    
    return <>
    {isCreateSuperCostError && <>
        <div className="col-span-12 text-red-500">
                {getUserErrorMessage(createSuperCostError, "Erreur lors de la création de userCost")}
            </div>
        </>
    }
    
    <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
            <Label htmlFor="superCost">Ajouter une super superCost</Label>
            <Input 
                value={montant}
                id="superCost" type="number" 
                onChange={(event) => {
                    setFormSupercost({
                        ...formSupercost,
                        montant: `${event.target.value}`
                    })
                    setMontant(Number(event.target.value));
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