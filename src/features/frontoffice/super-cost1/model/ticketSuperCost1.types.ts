export type SuperCost1GroupByCategoryTypeCout = {
    category: string,
    nombre_asset: number,
    type_cout: string,
    cout: number,
    total: number
}

export type CreateSuperCost1 = {
    id_ticket: number,
    id_item: number,
    category: string,
    type_cout: TYPE_COUT,
    cout: number,
    group_super_cost_1: string,
    mode_reouverture?: number,
    pourcentage?: number
}

export type UpdateSuperCost1ReouverturePayload = {
    cout: number,
    groupSuperCost1: string
    idTicket: number,
    idItem: number,
}

export type UpdateSuperCost1CoutSaisiePayload = {
    cout: number,
    groupSuperCost1: string
    idTicket: number,
    idItem: number,
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
    mode_reouverture: number
    pourcentage: number
}

export type Plafond = {
    pourcentage: number
}