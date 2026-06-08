import { getAssets } from "../../../../entities/asset/api/asset.api";
import { glpiGetPaginated } from "../../../../shared/api/glpiClient";
import { insertViewAssetItem } from "../lib/generalViewAssetItemsInsert";
import { type GeneralViewAssetItems, type GlpiAssetCommon } from "../model/generalViewAssetItems.types";

export async function getGeneralViewAssetItems(): Promise<GeneralViewAssetItems[]> {
  const assets = await getAssets();

  const result = await Promise.all(
    assets.map(async (asset) => {
      const limit = 100;
      let start = 0;
      let total = Infinity;

      const allGlpiAssetCommons: GlpiAssetCommon[] = [];
      while (start < total) {
        const params = new URLSearchParams({
          start: String(start),
          limit: String(limit),
        });

        const page = await glpiGetPaginated<GlpiAssetCommon>(`${asset.href}?${params.toString()}`);

        total = page.total;
        start += limit;
        

        allGlpiAssetCommons.push(...page.data);
      }


      return allGlpiAssetCommons.filter((glpiAssetCommon) => !glpiAssetCommon.is_deleted)
          .map((glpiAssetCommon) => { 
            return insertViewAssetItem({itemType: asset.name, glpiAssetCommonData: glpiAssetCommon})});
      })
  );
  return result.flat();
}