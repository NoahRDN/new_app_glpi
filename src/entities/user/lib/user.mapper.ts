import type { GlpiUser, User } from "../model/user.types";

export function mapGlpiUsersToUsers(glpiUsers : GlpiUser[]) : User[] {
    return glpiUsers.map((user) => ({
        id: user.id,
        username: user.username ?? "",
        realname: user.realname ?? "",
        firstname: user.firstname ?? "",
    }));
}