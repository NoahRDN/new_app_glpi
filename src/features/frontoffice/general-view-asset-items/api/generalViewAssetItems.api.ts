import { getAssets } from "../../../../entities/asset/api/asset.api";
import { glpiGetPaginated } from "../../../../shared/api/glpiClient";
import { buildGeneralViewAssetItemsFilter, insertViewAssetItem } from "../lib/generalViewAssetItems";
import { type GeneralViewAssetItems, type GeneralViewAssetItemsFilters, type GeneralViewAssetItemsPage, type GlpiAssetCommon } from "../model/generalViewAssetItems.types";

export async function getGeneralViewAssetItemsPage(
  page: number,
  limit: number,
  filters: GeneralViewAssetItemsFilters,
): Promise<GeneralViewAssetItemsPage> {
  const assets = await getAssets();
  console.log("taille: ", filters.itemtypes.length);
  console.log("content: ", filters.itemtypes);

  const selectedAssets =
    filters.itemtypes.length > 0
      ? assets.filter((asset) => filters.itemtypes.includes(asset.itemtype))
      : assets;

  const filter = buildGeneralViewAssetItemsFilter(filters);

  const globalOffset = page * limit;

  let remainingOffset = globalOffset;
  let remainingLimit = limit;
  let total = 0;

  const items: GeneralViewAssetItems[] = [];

  for (const asset of selectedAssets) {
    const countParams = new URLSearchParams({
      start: "0",
      limit: "1",
    });

    if (filter.length > 0) {
      countParams.set("filter", filter);
    }

    const countPage = await glpiGetPaginated<GlpiAssetCommon>(
      `${asset.href}?${countParams.toString()}`,
    );

    const assetTotal = countPage.total;
    total += assetTotal;

    if (assetTotal === 0) {
      continue;
    }

    if (remainingOffset >= assetTotal) {
      remainingOffset -= assetTotal;
      continue;
    }

    if (remainingLimit <= 0) {
      continue;
    }

    const dataParams = new URLSearchParams({
      start: String(remainingOffset),
      limit: String(remainingLimit),
    });

    if (filter.length > 0) {
      dataParams.set("filter", filter);
    }

    const dataPage = await glpiGetPaginated<GlpiAssetCommon>(
      `${asset.href}?${dataParams.toString()}`,
    );

    const mappedItems = dataPage.data.map((glpiAssetCommon) => {
      return insertViewAssetItem({
        itemType: asset.name,
        glpiAssetCommonData: glpiAssetCommon,
      });
    });

    items.push(...mappedItems);

    remainingLimit -= mappedItems.length;
    remainingOffset = 0;
  }

  return {
    data: items,
    total,
  };
}