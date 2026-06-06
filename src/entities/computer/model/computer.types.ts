import type { Entity } from "../../entity/model/entity.types";
import type { Group, GroupTech } from "../../group/model/group.types";
import type { Location } from "../../location/model/location.types";
import type { Manufacturer } from "../../manufacturer/model/manufacturer.types";
import type { Model } from "../../model/model/model.types";
import type { Status } from "../../status/model/status.types";
import type { Type } from "../../type/model/type.types";
import type { UserReference, UserTech } from "../../user/model/user.types";

export type ComputerRelations = {
  entity: Entity;
  group: Group[];
  group_tech: GroupTech[];
  location: Location;
  manufacturer: Manufacturer;
  model: Model;
  status: Status;
  type: Type;
  user: UserReference;
  user_tech: UserTech;
};
