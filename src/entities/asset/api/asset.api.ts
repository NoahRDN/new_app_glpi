import { glpiGet } from "../../../shared/api/glpiClient";
import type { Asset } from "../model/asset.types";

export async function fetchAssets(): Promise<Asset[]> {
  return glpiGet<Asset[]>("/assets");
}
