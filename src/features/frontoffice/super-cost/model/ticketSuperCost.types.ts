export type SuperCostGroupByCategory = {
    category: string,
    nombre_asset: number,
    cout_saisi: number,
    cout_glpi: number,
    total: number
}

export type CreateSuperCost = {
    cout_saisi: number,
    id_ticket: number,
    id_item: number,
    category: string,
    cout_glpi: number
}

export type SuperCost = {
    id: number,
    cout_saisi: number,
    id_ticket: string,
    id_item: number,
    category: string,
    cout_glpi: number
}

