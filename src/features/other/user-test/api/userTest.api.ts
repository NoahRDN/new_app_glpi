import { localDelete, localGet, localPost, localPut } from "../../../../shared/api/localClient";
import type { CreateUserTest, UpdateUserTest, UserTest } from "../model/userTest.types";

export async function getUsersTest() : Promise<UserTest[]>{
    return localGet<UserTest[]>("/user-test");
}

export async function getUserTest(id: number) : Promise<UserTest>{
    return localGet<UserTest>(`/user-test/${id}`);
}

export async function createUsersTest(payload: CreateUserTest) : Promise<UserTest>{
    return localPost<UserTest>("/user-test", payload);
}

export async function updateUserTest({payload, id}:{payload: UpdateUserTest, id: number}) : Promise<UserTest>{
    return localPut<UserTest>(`/user-test/${id}`, payload);
}

export async function deleteUsersTest(id: number) : Promise<void>{
    return localDelete(`/user-test/${id}`);
}
