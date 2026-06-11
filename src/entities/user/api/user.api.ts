import {
  glpiDelete,
  glpiGet,
  glpiGetPaginated,
  glpiPatch,
  glpiPost,
} from "../../../shared/api/glpiClient";
import { buildUserFilter } from "../lib/user.filter";
import { mapGlpiUsersToUsers, mapGlpiUserToUser } from "../lib/user.mapper";
import type { CreateUser, GlpiUser, UpdateUser, User, UserFilters } from "../model/user.types";

function normalizeUserKey(value: string) {
  return value.trim().toLowerCase();
}

function buildFullName(firstname: string, realname: string) {
  return `${firstname} ${realname}`.trim().toLowerCase();
}

function buildUsername(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .toLowerCase();
}

function doesUserMatchName(user: User, name: string) {
  const normalizedName = normalizeUserKey(name);

  return (
    normalizeUserKey(user.username) === normalizedName ||
    normalizeUserKey(user.realname) === normalizedName ||
    buildFullName(user.firstname, user.realname) === normalizedName ||
    buildFullName(user.realname, user.firstname) === normalizedName
  );
}

function parseImportedUserName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return {
      firstname: "",
      realname: "",
      username: "",
    };
  }

  if (parts.length === 1) {
    return {
      firstname: "",
      realname: parts[0],
      username: buildUsername(parts[0]),
    };
  }

  return {
    firstname: parts.slice(1).join(" "),
    realname: parts[0],
    username: buildUsername(parts.join(".")),
  };
}

export async function getUsersPage(
  {page, limit, filters,} :
  {page: number, limit: number, filters?: UserFilters}
){
  const start = page * limit;

  const params = new URLSearchParams({
    start: String(start),
    limit: String(limit),
  });

  if (filters) {
    const filter = buildUserFilter({ filters });

    if (filter) {
      params.set("filter", filter);
    }
  }
  

  return glpiGetPaginated<GlpiUser>(`/Administration/User?${params.toString()}`)
}

export async function getUsers(
  {filters,} :
  {filters?: UserFilters}
) {
  const firstPage = await getUsersPage({
    page: 0,
    limit: 100,
    filters,
  });

  const total = firstPage.total;
  const totalPages = Math.ceil(total / 100);

  const allItems = [...firstPage.data];

  for (let page = 1; page < totalPages; page++) {
    const nextPage = await getUsersPage({
      page: page,
      limit: 100,
      filters: filters,
    });

    allItems.push(...nextPage.data);
  }

  return allItems;
}

export async function getUser(userId: number | string): Promise<User> {
  const glpiUser = await glpiGet<GlpiUser>(`/Administration/User/${userId}`);

  return mapGlpiUserToUser(glpiUser);
}

export async function findUserByName(name: string): Promise<User | undefined> {
  const normalizedName = normalizeUserKey(name);

  if (normalizedName.length === 0) {
    return undefined;
  }

  const parsedName = parseImportedUserName(name);
  const candidateQueries = [
    normalizedName,
    parsedName.realname,
    parsedName.firstname,
    parsedName.username,
  ].filter((value, index, values) => value.length > 0 && values.indexOf(value) === index);

  const usersById = new Map<number, User>();

  for (const query of candidateQueries) {
    for (const field of ["username", "realname", "firstname"]) {
      const params = new URLSearchParams({
        limit: "100",
        start: "0",
      });

      params.set("filter", `${field}=ilike=*${query}*`);

      const page = await glpiGetPaginated<GlpiUser>(
        `/Administration/User?${params.toString()}`,
      );

      mapGlpiUsersToUsers(page.data).forEach((user) => {
        if (!user.is_deleted) {
          usersById.set(user.id, user);
        }
      });
    }
  }

  const matchedUser = [...usersById.values()].find((user) => doesUserMatchName(user, name));

  if (matchedUser) {
    return matchedUser;
  }

  return undefined;
}

export async function createUser(createUser : CreateUser) : Promise<User>{

  const glpiUser = await glpiPost<GlpiUser>("/Administration/User", createUser);

  return mapGlpiUserToUser(glpiUser);
}

export async function createUserFromName(name: string): Promise<User> {
  const parsedName = parseImportedUserName(name);

  return createUser({
    firstname: parsedName.firstname || undefined,
    realname: parsedName.realname || undefined,
    username: parsedName.username || undefined,
  });
}

export async function updateUser(updateUserPayload: UpdateUser): Promise<User> {
  const { id, ...payload } = updateUserPayload;
  const glpiUser = await glpiPatch<GlpiUser>(`/Administration/User/${id}`, payload);

  return mapGlpiUserToUser(glpiUser);
}

export async function deleteUser(userId : number){
  await glpiDelete(`/Administration/User/${userId}`)
}
