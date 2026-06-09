import type { Entity } from "../../../../entities/entity/model/entity.types";
import type { Manufacturer } from "../../../../entities/manufacturer/model/manufacturer.types";
import type { Status } from "../../../../entities/status/model/status.types";
import type { UserReference, UserTech } from "../../../../entities/user/model/user.types";

export type GeneralViewAssetItems = {
  id: number;
  name: string;

  itemType: string;
  itemTypeLabel: string;

  dateCreation?: string | null;
  dateMod?: string | null;
  entity?: Entity | null;
  isRecursive?: boolean;
  manufacturer?: Manufacturer | null;
  status?: Status | null;
  user?: UserReference | null;
  userTech?: UserTech | null;
  is_deleted?: boolean;
};

export type GlpiAssetCommon = {
  id: number;
  name: string;
  is_deleted?: boolean;
  date_creation?: string | null;
  date_mod?: string | null;
  is_recursive?: boolean;

  entity?: Entity | null;

  status?: Status | null;

  manufacturer?: Manufacturer | null;

  user?: UserReference | null;

  user_tech?: UserTech | null;
};

export type GeneralViewAssetItemsFilters = {
  name: string;
  itemtypes: string[];
  userId?: number;
};

export type GeneralViewAssetItemsPage = {
  data: GeneralViewAssetItems[];
  total: number;
};