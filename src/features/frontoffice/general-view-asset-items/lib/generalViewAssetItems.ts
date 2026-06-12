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

  if (filters.userId !== undefined && filters.userId !== null) {
    parts.push(`user.id==${filters.userId}`);
  }

  const dateCreationFrom = filters.dateCreationFrom?.trim() ?? "";
  const dateCreationTo = filters.dateCreationTo?.trim() ?? "";

  if (dateCreationFrom.length > 0) {
    parts.push(`date_creation=ge=${dateCreationFrom}T00:00:00Z`);
  }

  if (dateCreationTo.length > 0) {
    parts.push(`date_creation=le=${dateCreationTo}T23:59:59Z`);
  }

  return parts.join(";");
}

function normalizeSearchValue(value: string | undefined | null): string {
  return (value ?? "").trim().toLowerCase();
}

export function matchesGeneralViewAssetItemsSearch(
  item: GeneralViewAssetItems,
  search: string,
): boolean {
  const normalizedSearch = normalizeSearchValue(search);

  if (normalizedSearch.length === 0) {
    return true;
  }

  const searchableValues = [
    item.name,
    item.itemType,
    item.itemTypeLabel,
    item.entity?.name,
    item.entity?.completename,
    item.manufacturer?.name,
    item.user?.name,
    item.userTech?.name,
    item.status?.name,
  ];

  return searchableValues.some((value) =>
    normalizeSearchValue(value).includes(normalizedSearch),
  );
}
