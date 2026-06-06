export type UserRole = "super-admin" | "technician" | "observer";

export type User = {
  id: number,
  username: string,
  realname: string,
  firstname: string,
  is_deleted: boolean
};

export type GlpiUser = {
  id: number;
  username?: string;
  realname?: string;
  firstname?: string;
  is_deleted?: boolean;
};

export type CreateUser = {
  username?: string;
  realname?: string;
  firstname?: string;
};

export type UpdateUser = CreateUser & {
  id: number;
};

export type UserReference = {
  id: number;
  name: string;
};

export type UserTech = UserReference;
