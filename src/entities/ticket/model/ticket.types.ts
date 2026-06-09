import type { Entity } from "../../entity/model/entity.types";
import type { Location } from "../../location/model/location.types";

export type TicketNamedReference = {
  id: number;
  name: string;
};

export type TicketTeamReference = TicketNamedReference & {
  role: string;
  type: string;
};

export type TicketCostReference = {
  id: number;
};

export type Ticket = {
  actiontime: number;
  begin_waiting_date?: string | null;
  category?: TicketNamedReference | null;
  close_duration: number;
  content: string;
  costs: TicketCostReference[];
  date: string;
  date_close?: string | null;
  date_creation: string;
  date_mod: string;
  date_solve?: string | null;
  entity?: Entity | null;
  external_id?: string | null;
  global_validation: number;
  id: number;
  impact: number;
  internal_resolution_date?: string | null;
  internal_take_into_account_date?: string | null;
  is_deleted?: boolean;
  location?: Location | null;
  name: string;
  ola_level_ttr?: TicketNamedReference | null;
  ola_tto?: TicketNamedReference | null;
  ola_tto_begin_date?: string | null;
  ola_ttr?: TicketNamedReference | null;
  ola_ttr_begin_date?: string | null;
  ola_waiting_duration: number;
  priority: number;
  request_type?: TicketNamedReference | null;
  resolution_date?: string | null;
  resolution_duration: number;
  sla_level_ttr?: TicketNamedReference | null;
  sla_tto?: TicketNamedReference | null;
  sla_ttr?: TicketNamedReference | null;
  sla_waiting_duration: number;
  status?: TicketNamedReference | null;
  take_into_account_date?: string | null;
  take_into_account_duration: number;
  team: TicketTeamReference[];
  type: number;
  urgency: number;
  user_editor?: TicketNamedReference | null;
  user_recipient?: TicketNamedReference | null;
  waiting_duration: number;
};

export type CreateTicketPayload = {
  name: string;
  content: string;
  type: number;
  urgency?: number;
  impact?: number;
  priority?: number;
};

export type CreateTicketResponse = {
  id: number;
  href: string;
};
