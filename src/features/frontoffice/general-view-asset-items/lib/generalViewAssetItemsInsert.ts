import { generalViewAssetItemDefault } from "../model/generalViewAssetItems.config";
import type { GeneralViewAssetItems, GlpiAssetCommon } from "../model/generalViewAssetItems.types";

export function insertViewAssetItem({itemType, glpiAssetCommonData} : {itemType: string, glpiAssetCommonData: GlpiAssetCommon}){
  const generalViewAssetItem: GeneralViewAssetItems = structuredClone(generalViewAssetItemDefault);
  generalViewAssetItem.name = glpiAssetCommonData.name;
  generalViewAssetItem.itemType = itemType;
  generalViewAssetItem.dateCreation = glpiAssetCommonData.date_creation;
  generalViewAssetItem.dateMod = glpiAssetCommonData.date_mod;
  generalViewAssetItem.entity = glpiAssetCommonData.entity;
  generalViewAssetItem.isRecursive = glpiAssetCommonData.is_recursive;
  generalViewAssetItem.status = glpiAssetCommonData.status;
  generalViewAssetItem.manufacturer = glpiAssetCommonData.manufacturer;
  generalViewAssetItem.user = glpiAssetCommonData.user;
  generalViewAssetItem.userTech = glpiAssetCommonData.user_tech;
  generalViewAssetItem.is_deleted = glpiAssetCommonData.is_deleted;
  
  return generalViewAssetItem;
}