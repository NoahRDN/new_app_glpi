import { glpiGet, glpiPost } from "../../../shared/api/glpiClient";
import { mapGlpiUsersToUsers } from "../lib/user.mapper";
import type { CreateUser, GlpiUser, User } from "../model/user.types";


export async function getUsers(): Promise<User[]> {
  const glpiUsers = await glpiGet<GlpiUser[]>("/Administration/User");

  return mapGlpiUsersToUsers(glpiUsers);
}

export async function createUser(createUser : CreateUser){

  const glpiUser = await glpiPost<GlpiUser>("/Administration/User", createUser);
  
  return {
    id: glpiUser.id,
    username: glpiUser.username ?? "",
    realname: glpiUser.realname ?? "",
    firstname: glpiUser.firstname ?? "",
  };
}