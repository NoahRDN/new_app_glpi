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
