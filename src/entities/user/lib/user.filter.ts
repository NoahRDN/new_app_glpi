import type { UserFilters } from "../model/user.types";

export function buildUserFilter(
    {filters, parts = ["is_deleted==false"]}:
    {filters: UserFilters, parts?: string[]}
):string | undefined {
    const name = filters.name.trim();

    if (name.length > 0) {
        parts.push(`name=ilike=*${name}*`);
    }

    return parts.join(";");
}