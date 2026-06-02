export type UserRole = "super-admin" | "technician" | "observer";

export type User = {
  email: string;
  fullName: string;
  id: number;
  role: UserRole;
};
