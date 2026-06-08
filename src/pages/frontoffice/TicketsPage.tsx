import { TicketsAdd } from "../../features/frontoffice/ticket/components/TicketsAdd";

export function TicketsPage(){
    return <section className="col-span-12 rounded-[34px] border p-6 shadow-(--shadow-soft) bg-(--panel-strong) border-(--panel-border)">
        <TicketsAdd />
    </section>
}