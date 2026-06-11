import type {CreateUser, User, UserFilters} from "./user.types";

export const defaultUser: User = {
  id: 0,
  username: "",
  realname: "",
  firstname: "",
  is_deleted: false
};

export const defaultUserFilter: UserFilters = {
  name: ""
};

export const defaultCreateUser: CreateUser = {
  username: "",
  realname: "",
  firstname: "",
};

export const TICKET_TYPE = {
  INCIDENT: 1,
  REQUEST: 2,
} as const;

export const TICKET_TYPE_LABELS: Record<number, string> = {
  1: "Incident",
  2: "Demande",
};