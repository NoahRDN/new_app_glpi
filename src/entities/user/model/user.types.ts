export type UserRole = "super-admin" | "technician" | "observer";

export type User = {
  id: number,
  username: string,
  realname: string,
  firstname: string,
};
