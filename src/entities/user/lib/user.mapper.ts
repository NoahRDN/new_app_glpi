import type { GlpiUser, User } from "../model/user.types";

export function mapGlpiUsersToUsers(glpiUsers : GlpiUser[]) : User[] {
    return glpiUsers.map((user) => (
        mapGlpiUserToUser(user)
    ));
}

export function mapGlpiUserToUser(glpiUser : GlpiUser) : User {
    return {
        id: glpiUser.id,
        username: glpiUser.username ?? "",
        realname: glpiUser.realname ?? "",
        firstname: glpiUser.firstname ?? "",
        is_deleted: glpiUser.is_deleted ?? false,
    };
}