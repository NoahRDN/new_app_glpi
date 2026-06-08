import type { Entity } from "../../entity/model/entity.types";
import type { Group, GroupTech } from "../../group/model/group.types";
import type { Location } from "../../location/model/location.types";
import type { Manufacturer } from "../../manufacturer/model/manufacturer.types";
import type { Model } from "../../model/model/model.types";
import type { Status } from "../../status/model/status.types";
import type { Type } from "../../type/model/type.types";
import type { UserReference, UserTech } from "../../user/model/user.types";

export type PrinterNamedReference = {
  id: number;
  name: string;
};

export type Printer = {
  autoupdatesystem: PrinterNamedReference;
  comment: string;
  contact: string;
  contact_num: string;
  date_creation: string;
  date_mod: string;
  entity: Entity;
  group: Group[];
  group_tech: GroupTech[];
  has_ethernet: boolean;
  has_parallel: boolean;
  has_serial: boolean;
  has_usb: boolean;
  has_wifi: boolean;
  id: number;
  is_deleted: boolean;
  is_dynamic: boolean;
  is_global: boolean;
  is_recursive: boolean;
  is_template: boolean;
  location: Location;
  manufacturer: Manufacturer;
  model: Model;
  name: string;
  network: PrinterNamedReference;
  otherserial: string;
  serial: string;
  snmp_credential: PrinterNamedReference;
  status: Status;
  sysdescr: string;
  template_name: string | null;
  ticket_tco: number;
  type: Type;
  user: UserReference;
  user_tech: UserTech;
  uuid: string;
  last_inventory_update: string | null;
};

export type GlpiPrinter = Printer;

export type PrinterPayloadReferenceId = number;

export type CreatePrinter = {
  comment?: string;
  contact?: string;
  contact_num?: string;
  entity_id?: PrinterPayloadReferenceId;
  group_ids?: PrinterPayloadReferenceId[];
  group_tech_ids?: PrinterPayloadReferenceId[];
  has_ethernet?: boolean;
  has_parallel?: boolean;
  has_serial?: boolean;
  has_usb?: boolean;
  has_wifi?: boolean;
  is_global?: boolean;
  is_recursive?: boolean;
  is_template?: boolean;
  location_id?: PrinterPayloadReferenceId;
  manufacturer_id?: PrinterPayloadReferenceId;
  model_id?: PrinterPayloadReferenceId;
  name: string;
  network_id?: PrinterPayloadReferenceId;
  otherserial?: string;
  serial?: string;
  snmp_credential_id?: PrinterPayloadReferenceId;
  status_id?: PrinterPayloadReferenceId;
  sysdescr?: string;
  type_id?: PrinterPayloadReferenceId;
  user_id?: PrinterPayloadReferenceId;
  user_tech_id?: PrinterPayloadReferenceId;
  uuid?: string;
};

export type UpdatePrinter = Partial<CreatePrinter> & {
  id: number;
};

export type PrinterFilters = {
  dateCreationFrom?: string;
  dateCreationTo?: string;
  manufacturerId?: number | null;
  name: string;
  statusId?: number | null;
};
