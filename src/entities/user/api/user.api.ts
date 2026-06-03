import { glpiDelete, glpiGet, glpiPatch, glpiPost } from "../../../shared/api/glpiClient";
import { mapGlpiUsersToUsers, mapGlpiUserToUser } from "../lib/user.mapper";
import type { CreateUser, GlpiUser, UpdateUser, User } from "../model/user.types";


export async function getUsers(): Promise<User[]> {
  const glpiUsers = await glpiGet<GlpiUser[]>("/Administration/User");

  return mapGlpiUsersToUsers(glpiUsers);
}

export async function createUser(createUser : CreateUser) : Promise<User>{

  const glpiUser = await glpiPost<GlpiUser>("/Administration/User", createUser);

  return mapGlpiUserToUser(glpiUser);
}

export async function updateUser(updateUserPayload: UpdateUser): Promise<User> {
  const { id, ...payload } = updateUserPayload;
  const glpiUser = await glpiPatch<GlpiUser>(`/Administration/User/${id}`, payload);

  return mapGlpiUserToUser(glpiUser);
}

export async function deleteUser(userId : number){
  await glpiDelete(`/Administration/User/${userId}`)
}
