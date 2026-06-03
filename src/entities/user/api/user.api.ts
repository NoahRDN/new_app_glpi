import { glpiGet } from "../../../shared/api/glpiClient";
import { mapGlpiUsersToUsers } from "../lib/user.mapper";
import type { GlpiUser, User } from "../model/user.types";


export async function getUsers(): Promise<User[]> {
  const glpiUsers = await glpiGet<GlpiUser[]>("/Administration/User");

  return mapGlpiUsersToUsers(glpiUsers);
}