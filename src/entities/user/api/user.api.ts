import { glpiGet } from "../../../shared/api/glpiClient";
import type { User } from "../model/user.types";

type GlpiUser = {
  id: number;
  name?: string;
  realname?: string;
  firstname?: string;
};

export async function getUsers(): Promise<User[]> {
  const glpiUsers = await glpiGet<GlpiUser[]>("/Administration/User");

  return glpiUsers.map((user) => ({
    id: user.id,
    username: user.name ?? "",
    realname: user.realname ?? "",
    firstname: user.firstname ?? "",
  }));
}