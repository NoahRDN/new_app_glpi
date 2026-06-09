import type { GeneralViewAssetItems, GeneralViewAssetItemsFilters, GlpiAssetCommon } from "../model/generalViewAssetItems.types";

export function insertViewAssetItem({
  itemType,
  itemTypeLabel,
  glpiAssetCommonData,
}: {
  itemType: string;
  itemTypeLabel: string;
  glpiAssetCommonData: GlpiAssetCommon;
}): GeneralViewAssetItems {
  return {
    id: glpiAssetCommonData.id,
    name: glpiAssetCommonData.name,

    itemType,
    itemTypeLabel,

    dateCreation: glpiAssetCommonData.date_creation,
    dateMod: glpiAssetCommonData.date_mod,
    entity: glpiAssetCommonData.entity,
    isRecursive: glpiAssetCommonData.is_recursive,
    status: glpiAssetCommonData.status,
    manufacturer: glpiAssetCommonData.manufacturer,
    user: glpiAssetCommonData.user,
    userTech: glpiAssetCommonData.user_tech,
    is_deleted: glpiAssetCommonData.is_deleted,
  };
}

export function buildGeneralViewAssetItemsFilter(
  filters: GeneralViewAssetItemsFilters,
): string {
  const parts: string[] = [];

  parts.push("is_deleted==false");

  const name = filters.name.trim();

  if (name.length > 0) {
    parts.push(`name=ilike=*${name}*`);
  }

  if (filters.userId !== undefined && filters.userId !== null) {
    parts.push(`user.id==${filters.userId}`);
  }

  return parts.join(";");
}