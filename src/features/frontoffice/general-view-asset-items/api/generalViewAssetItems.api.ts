import { getAssets } from "../../../../entities/asset/api/asset.api";
import { glpiGetPaginated } from "../../../../shared/api/glpiClient";
import {
  buildGeneralViewAssetItemsFilter,
  insertViewAssetItem,
  matchesGeneralViewAssetItemsSearch,
} from "../lib/generalViewAssetItems";
import { type GeneralViewAssetItems, type GeneralViewAssetItemsFilters, type GeneralViewAssetItemsPage, type GlpiAssetCommon } from "../model/generalViewAssetItems.types";

async function getAllAssetItemsByType(params: {
  filter: string;
  href: string;
}): Promise<GlpiAssetCommon[]> {
  const items: GlpiAssetCommon[] = [];
  const pageSize = 100;
  let start = 0;
  let total = 0;

  do {
    const queryParams = new URLSearchParams({
      start: String(start),
      limit: String(pageSize),
    });

    if (params.filter.length > 0) {
      queryParams.set("filter", params.filter);
    }

    const page = await glpiGetPaginated<GlpiAssetCommon>(
      `${params.href}?${queryParams.toString()}`,
    );

    items.push(...page.data);
    total = page.total;
    start += page.data.length;
  } while (start < total);

  return items;
}

export async function getGeneralViewAssetItemsPage({
  page,
  limit,
  filters
}:{
  page: number,
  limit: number,
  filters: GeneralViewAssetItemsFilters
}): Promise<GeneralViewAssetItemsPage> {
  
  const assets = await getAssets();

  const selectedAssets =
    filters.itemtypes.length > 0
      ? assets.filter((asset) => filters.itemtypes.includes(asset.itemtype))
      : assets;

  const filter = buildGeneralViewAssetItemsFilter(filters);
  const items: GeneralViewAssetItems[] = [];

  for (const asset of selectedAssets) {
    const assetItems = await getAllAssetItemsByType({
      filter,
      href: asset.href,
    });

    const mappedItems = assetItems.map((glpiAssetCommon) =>
      insertViewAssetItem({
        itemType: asset.itemtype,
        itemTypeLabel: asset.name,
        glpiAssetCommonData: glpiAssetCommon,
      })
    );

    items.push(...mappedItems);
  }

  const filteredItems = items.filter((item) =>
    matchesGeneralViewAssetItemsSearch(item, filters.name),
  );

  const total = filteredItems.length;
  const start = page * limit;
  const paginatedItems = filteredItems.slice(start, start + limit);

  return {
    data: paginatedItems,
    total,
  };
}

export async function getAllGeneralViewAssetItems(
  filters: GeneralViewAssetItemsFilters,
): Promise<GeneralViewAssetItems[]> {
  const firstPage = await getGeneralViewAssetItemsPage({
    page: 0,
    limit: 100,
    filters,
  });

  const total = firstPage.total;
  const totalPages = Math.ceil(total / 100);

  const allItems = [...firstPage.data];

  for (let page = 1; page < totalPages; page++) {
    const nextPage = await getGeneralViewAssetItemsPage({
      page,
      limit: 100,
      filters,
    });

    allItems.push(...nextPage.data);
  }

  return allItems;
}
