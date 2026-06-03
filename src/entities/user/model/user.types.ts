export type UserRole = "super-admin" | "technician" | "observer";

export type User = {
  id: number,
  username: string,
  realname: string,
  firstname: string,
};

export type GlpiUser = {
  id: number;
  username?: string;
  realname?: string;
  firstname?: string;
};

export type CreateUser = {
  username?: string;
  realname?: string;
  firstname?: string;
};
