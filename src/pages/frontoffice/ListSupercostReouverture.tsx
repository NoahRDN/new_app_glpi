import { useState } from "react";
import { useSuperCost1AllReouverture } from "../../features/frontoffice/super-cost1/hooks/useSuperCost1AllReouverture";
import { useSuperCosts1AllSuperCost } from "../../features/frontoffice/super-cost1/hooks/useSuperCosts1AllSuperCost";
import { Button } from "../../shared/ui/Button";
import { DataTable } from "../../shared/ui/DataTable";
import { Modal } from "../../shared/ui/Modal";
import { Label } from "../../shared/ui/Label";
import { Input } from "../../shared/ui/Input";
import { Select } from "../../shared/ui/Select";
import { closeChoice, reouverturChoice } from "../../features/frontoffice/super-cost1/lib/traitementScenarioTicket";
import type { SuperCost1 } from "../../features/frontoffice/super-cost1/model/ticketSuperCost1.types";
import { getTicket } from "../../entities/ticket/api/ticket.api";

export function ListSupercostReouverture(){
    const {
        data: superCosts1AllSuperCostData
    }=  useSuperCosts1AllSuperCost()

    const {
        data: superCost1AllReouvertureData
    }=  useSuperCost1AllReouverture()

    const [isModalOpenReouverture, setIsModalOpenReouverture] = useState(false);
    const [isModalOpenCoutSaisie, setIsModalOpenCoutSaisie] = useState(false);
    const [cout, setCout] = useState<number>(0);    
    const [modeReouverture, setModeReouverture] = useState<number>(1)
    const [superCost1Update, setsuperCost1Update] = useState<SuperCost1 | null>(null)
    
    async function handleSubmitModificationCoutSaisie(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        if (superCost1Update === null) {
            console.error("aucun supercost trouvé")
            return 
        }
        const superCost1ReouvertureUpdateValue = superCost1Update;
        const coutValue = cout;
        console.log("coutValue interface: ", coutValue)
        const ticket = await getTicket(Number(superCost1ReouvertureUpdateValue?.id_ticket))
        console.log("ticket: ", ticket)
        await closeChoice({
            ticket: ticket,
            cout: coutValue,
            isUpdate: true,
            group_super_cost_1_update: superCost1ReouvertureUpdateValue.group_super_cost_1,
            id_ticket_update: ticket.id
        })
    }

    async function handleSubmitModificationReouverture(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        
        if (superCost1Update === null) {
            console.error("aucun supercost trouvé")
            return 
        }
        const coutValue = cout;
        const modeReouvertureValue = modeReouverture;
        const superCost1ReouvertureUpdateValue = superCost1Update;
        const ticket = await getTicket(Number(superCost1ReouvertureUpdateValue?.id_ticket))
        console.log("ticket: ", ticket)
        
        console.log("hola")
        await reouverturChoice({
            ticket: ticket,
            modeReouveture: modeReouvertureValue,
            cout: coutValue,
            isUpdate: true,
            group_super_cost_1_update: superCost1ReouvertureUpdateValue.group_super_cost_1,
            id_ticket_update: ticket.id,
            pourcentage: cout
        })
    }

    if (isModalOpenReouverture) {
        return <Modal
            isOpen={isModalOpenReouverture}
            title="Modification reouverture ticket"
            onClose={() => {
                setIsModalOpenReouverture(false)
                }}
            >
            <form className="flex gap-3 flex-col" onSubmit={handleSubmitModificationReouverture}>
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
                        onClick={() => setIsModalOpenReouverture(false)}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" className="w-full flex items-center flex-col">
                        { 'update '}
                    </Button>
                </div>
            </form>
        </Modal>
    }

    if (isModalOpenCoutSaisie) {
        return <Modal
            isOpen={isModalOpenCoutSaisie}
            title="Modification Cout Saisie"
            onClose={() => {
                setIsModalOpenCoutSaisie(false)
                }}
            >
            <form className="flex gap-3 flex-col" onSubmit={handleSubmitModificationCoutSaisie}>
                <Label htmlFor="superCost">Ajouter une cout saisie (%)</Label>
                <Input 
                    value={cout}
                    id="superCost" type="number" 
                    onChange={(event) => {
                        setCout(Number(event.target.value));
                    }}
                />

                <div className="flex gap-3">
                    <Button
                        type="button"
                        isWithBackground={false}
                        className="w-full flex items-center flex-col"
                        onClick={() => setIsModalOpenCoutSaisie(false)}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" className="w-full flex items-center flex-col">
                        { 'update cout saisie'}
                    </Button>
                </div>
            </form>
        </Modal>
    }


    return <div className="p-5 bg-white col-span-12">
        <section>
            <h1>List SuperCost</h1>
            <DataTable
                tableHeads={[
                    "N° ligne",
                    "id", 
                    "id_ticket",
                    "type cout",
                    "cout",
                    "category",
                    "id item",
                    "Action"]
                }
            >
                {superCosts1AllSuperCostData && superCosts1AllSuperCostData.map((superCosts1AllSuperCost, index) => {
                    return <tr>
                        <td className="border border-(--panel-border) px-4 py-4">{index + 1}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCosts1AllSuperCost.id}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCosts1AllSuperCost.id_ticket}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCosts1AllSuperCost.type_cout}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCosts1AllSuperCost.cout}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCosts1AllSuperCost.category}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCosts1AllSuperCost.id_item}</td>
                        <td className="border border-(--panel-border) px-4 py-4">
                            <Button
                                onClick={() => {
                                    setIsModalOpenCoutSaisie(true)
                                    setsuperCost1Update(superCosts1AllSuperCost)
                                }}
                            >
                                Modifier
                            </Button>
                        </td>
                    </tr>
                })}
            </DataTable>
        </section>

         <section>
            <h1>List Reouverture</h1>
            <DataTable
                tableHeads={[
                    "N° ligne",
                    "id",
                    "id_ticket",
                    "type cout",
                    "cout",
                    "category",
                    "id item",
                "Action"]
                }
            >
                {superCost1AllReouvertureData && superCost1AllReouvertureData.map((superCost1AllReouverture, index) => {
                    return <tr>
                        <td className="border border-(--panel-border) px-4 py-4">{index + 1}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCost1AllReouverture.id}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCost1AllReouverture.id_ticket}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCost1AllReouverture.type_cout}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCost1AllReouverture.cout}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCost1AllReouverture.category}</td>
                        <td className="border border-(--panel-border) px-4 py-4">{superCost1AllReouverture.id_item}</td>
                        <td className="border border-(--panel-border) px-4 py-4">
                            <Button
                                onClick={() => {
                                    setsuperCost1Update(superCost1AllReouverture)
                                    setIsModalOpenReouverture(true)
                                }}
                            >
                                Modifier
                            </Button>
                        </td>
                    </tr>
                })}
            </DataTable>
        </section>
    </div>
}