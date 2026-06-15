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
import { useSuperCost1ByIdTicket } from "../../super-cost1/hooks/useSuperCost1ByIdTicket";


type AddSuperCost1Props = {
  onClose: () => void;
  ticket: Ticket | null;
};

export function AddReouverture({ticket, onClose}: AddSuperCost1Props){
    const [formSupercost1, setFormSupercost1] = useState<CreateSuperCost1>({
        cout: -1,
        id_ticket: -1,
        id_item: -1,
        category: "",
        type_cout: "reouverture",
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

    const {
        data: superCost1ByIdTicketData
    }= useSuperCost1ByIdTicket(ticket ? ticket.id : 0)
    

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (formSupercost1 !== null && ticket !== null) {
            if (totalCostTicket === -1) {
                throw new Error("totalCostTicket non présent")
            }
            const group_super_cost_1 = superCost1ByIdTicketData?.at(0)?.group_super_cost_1


            let cout_saisi_final : number = 0;
            if (superCost1ByIdTicketData) {
                superCost1ByIdTicketData.map((superCost1) => {
                    cout_saisi_final = cout_saisi_final + superCost1.cout 
                    
                })
            }
            cout_saisi_final = formSupercost1.cout *  cout_saisi_final / 100
            
            if (group_super_cost_1) {
                ticketAssetLinks?.map(async (ticketAssetLink) => {
                    try {
                        await createSuperCost1Async({id_ticket: ticket.id,cout:cout_saisi_final, category: ticketAssetLink.itemtype, id_item: ticketAssetLink.items_id, type_cout:formSupercost1.type_cout, group_super_cost_1: group_super_cost_1})
                    } catch (error) {
                        console.error(error)
                    }
                })
            }

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
            <Label htmlFor="superCost">Ajouter une cout ouverture (%)</Label>
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