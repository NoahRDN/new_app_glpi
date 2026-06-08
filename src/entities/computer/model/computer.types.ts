import type { Entity } from "../../entity/model/entity.types";
import type { Group, GroupTech } from "../../group/model/group.types";
import type { Location } from "../../location/model/location.types";
import type { Manufacturer } from "../../manufacturer/model/manufacturer.types";
import type { Model } from "../../model/model/model.types";
import type { Status } from "../../status/model/status.types";
import type { Type } from "../../type/model/type.types";
import type { UserReference, UserTech } from "../../user/model/user.types";

export type ComputerNamedReference = {
  id: number;
  name: string;
};

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

export type Computer = {
  autoupdatesystem: ComputerNamedReference;
  comment: string;
  contact: string;
  contact_num: string;
  date_creation: string;
  date_mod: string;
  entity: Entity;
  group: Group[];
  group_tech: GroupTech[];
  id: number;
  is_deleted: boolean;
  is_dynamic: boolean;
  is_recursive: boolean;
  is_template: boolean;
  last_boot: string | null;
  last_inventory_update: string | null;
  location: Location;
  manufacturer: Manufacturer;
  model: Model;
  name: string;
  network: ComputerNamedReference;
  otherserial: string;
  serial: string;
  status: Status;
  template_name: string | null;
  ticket_tco: number;
  type: Type;
  user: UserReference;
  user_tech: UserTech;
  uuid: string;
};

export type GlpiComputer = Computer;

export type ComputerPayloadReferenceId = number;

export type CreateComputer = {
  comment?: string;
  contact?: string;
  contact_num?: string;
  entity_id?: ComputerPayloadReferenceId;
  group_tech_ids?: ComputerPayloadReferenceId[];
  group_ids?: ComputerPayloadReferenceId[];
  is_recursive?: boolean;
  is_template?: boolean;
  location_id?: ComputerPayloadReferenceId;
  manufacturer_id?: ComputerPayloadReferenceId;
  model_id?: ComputerPayloadReferenceId;
  name: string;
  network_id?: ComputerPayloadReferenceId;
  otherserial?: string;
  serial?: string;
  status_id?: ComputerPayloadReferenceId;
  type_id?: ComputerPayloadReferenceId;
  user_id?: ComputerPayloadReferenceId;
  user_tech_id?: ComputerPayloadReferenceId;
  uuid?: string;
};

export type UpdateComputer = Partial<CreateComputer> & {
  id: number;
};

export type ComputerFilters = {
  name: string;
  dateCreationFrom?: string;
  dateCreationTo?: string;
  statusId?: number | null;
  manufacturerId?: number | null;
};

