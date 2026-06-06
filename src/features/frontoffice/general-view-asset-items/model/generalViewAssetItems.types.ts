import type { Entity } from "../../../../entities/entity/model/entity.types";
import type { Manufacturer } from "../../../../entities/manufacturer/model/manufacturer.types";
import type { Status } from "../../../../entities/status/model/status.types";
import type { UserReference, UserTech } from "../../../../entities/user/model/user.types";

export type GeneralViewAssetItems = {
  assetType: string;
  dateCreation: string;
  dateMod: string;
  entity: Entity;
  isRecursive: boolean;
  manufacturer: Manufacturer;
  name: string;
  status: Status;
  user: UserReference;
  userTech: UserTech;
};
