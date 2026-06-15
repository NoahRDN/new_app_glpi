export type SuperCost1GroupByCategory = {
    category: string,
    nombre_asset: number,
    cout_saisi: number,
    cout_glpi: number,
    total: number
}

export type CreateSuperCost1 = {
    id_ticket: number,
    id_item: number,
    category: string,
    type_cout: TYPE_COUT,
    cout: number,
    group_super_cost_1: string
}

type TYPE_COUT = 
    | "cout_saisi" 
    | "reouverture" 
    | "glpi";

export type SuperCost1 = {
    id: number,
    type_cout: TYPE_COUT,
    cout: number,
    id_ticket: string,
    id_item: number,
    category: string,
    group_super_cost_1: string,
    created_at: string
}