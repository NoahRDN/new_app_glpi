import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { Input } from "../../../../shared/ui/Input";
import type { CreateSuperCost1 } from "../../super-cost1/model/ticketSuperCost1.types";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import type { Ticket } from "../../../../entities/ticket/model/ticket.types";
import { useTicketAssetLinks } from "../../ticket/hooks/useTicketAssetLinks";
import { useTicketsCostByIds } from "../../ticket-costs/hooks/useTicketsCostByIds";
import { totalCost } from "../../../../entities/ticket-cost/lib/ticketCost";
import { useCreateSuperCost1 } from "../../super-cost1/hooks/useCreateSuperCost1";


// [fix] a revoir la valeur reel a assigne group_super_cost_1
type AddSuperCost1Props = {
  onClose: () => void;
  ticket: Ticket | null;
};

export function AddSuperCost1({ticket, onClose}: AddSuperCost1Props){
    const [formSupercost1, setFormSupercost1] = useState<CreateSuperCost1>({
        cout: -1,
        id_ticket: -1,
        id_item: -1,
        category: "",
        type_cout: "cout_saisi",
        group_super_cost_1: ""
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
        mutateAsync: createSuperCost1Async,
        isPending: isCreatingSuperCost1,
        isError: isCreateSuperCost1Error,
        error: createSuperCost1Error,
    } = useCreateSuperCost1();    

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (formSupercost1 !== null && ticket !== null) {
            const itemsType : string[] = [];
            const nombreCategoryTicketAssetLinks = ticketAssetLinks ? ticketAssetLinks.reduce((sum, ticketAssetLink) => {
                if (!itemsType.includes(ticketAssetLink.itemtype)) {
                    itemsType.push(ticketAssetLink.itemtype);
                    return sum + 1;
                }
                return sum;
            } ,0) : 0;
            const cout_saisi_final = formSupercost1.cout / nombreCategoryTicketAssetLinks;
            ticketAssetLinks?.map(async (ticketAssetLink) => {
                try {
                    await createSuperCost1Async({id_ticket: ticket.id,cout:cout_saisi_final, category: ticketAssetLink.itemtype, id_item: ticketAssetLink.items_id, type_cout:formSupercost1.type_cout, group_super_cost_1: formSupercost1.group_super_cost_1})
                    await createSuperCost1Async({id_ticket: ticket.id,cout:totalCostTicket, category: ticketAssetLink.itemtype, id_item: ticketAssetLink.items_id, type_cout: "glpi", group_super_cost_1: formSupercost1.group_super_cost_1})
                } catch (error) {
                    console.error(error)
                }
            })
        } else{
            throw new Error("Aucun donné à créer reçu")
        }
        
        onClose()
    }

    
    
    return <>
    {isCreateSuperCost1Error && <>
        <div className="col-span-12 text-red-500">
                {getUserErrorMessage(createSuperCost1Error, "Erreur lors de la création de userCost")}
            </div>
        </>
    }
    
    <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
            <Label htmlFor="superCost">Ajouter une superCost1</Label>
            <Input 
                value={montant}
                id="superCost" type="number" 
                onChange={(event) => {
                    setFormSupercost1({
                        ...formSupercost1
                        ,cout: Number(event.target.value)
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
                        {isCreatingSuperCost1 ? 'creation userCost' : 'Ajouter'}
                    </Button>
                </div>
        </form>
    </>
}