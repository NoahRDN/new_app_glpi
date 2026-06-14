import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { Input } from "../../../../shared/ui/Input";
import { useCreateSuperCost } from "../../super-cost/hooks/useCreateSuperCost";
import type { CreateSuperCost } from "../../super-cost/model/ticketSuperCost.types";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { useTicketAssetLinks } from "../../ticket/hooks/useTicketAssetLinks";
import { useTicketsCostByIds } from "../../ticket-costs/hooks/useTicketsCostByIds";
import { totalCost } from "../../../../entities/ticket-cost/lib/ticketCost";

type AddSuperCostProps = {
  onClose: () => void;
  ticket: Ticket | null;
};

export function AddSuperCost({ticket, onClose}: AddSuperCostProps){
    const [formSupercost, setFormSupercost] = useState<CreateSuperCost>({
        cout_saisi: -1,
        id_ticket: -1,
        id_item: -1,
        category: "",
        cout_glpi: -1
    });

    const idsCost = ticket ? ticket.costs.map((cost) => cost.id) : []
    const {
        data: ticketsCostData,
    } = useTicketsCostByIds(idsCost)

    const {
        data: ticketAssetLinksData
    } = useTicketAssetLinks()

    const ticketAssetLinks = ticketAssetLinksData?.filter((link) => link.tickets_id === ticket?.id);
    const totalCostTicket = ticketsCostData ? ticketsCostData.reduce((sum, ticketCost) => {
        return sum + totalCost(ticketCost);
    }, 0) : -1;
        
    const [montant, setMontant] = useState<number>(0);

    const {
        mutateAsync: createSuperCostAsync,
        isPending: isCreatingSuperCost,
        isError: isCreateSuperCostError,
        error: createSuperCostError,
    } = useCreateSuperCost();    

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (formSupercost !== null && ticket !== null) {
            const itemsType : string[] = [];
            const nombreCategoryTicketAssetLinks = ticketAssetLinks ? ticketAssetLinks.reduce((sum, ticketAssetLink) => {
                if (!itemsType.includes(ticketAssetLink.itemtype)) {
                    itemsType.push(ticketAssetLink.itemtype);
                    return sum + 1;
                }
                return sum;
            } ,0) : 0;
            const cout_saisi_final = formSupercost.cout_saisi / nombreCategoryTicketAssetLinks;
            ticketAssetLinks?.map(async (ticketAssetLink) => await createSuperCostAsync({id_ticket: ticket.id,cout_saisi:cout_saisi_final, category: ticketAssetLink.itemtype, id_item: ticketAssetLink.items_id, cout_glpi:totalCostTicket}))
        } else{
            throw new Error("Aucun donné à créer reçu")
        }
        
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
                        ...formSupercost
                        ,cout_saisi: Number(event.target.value)
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