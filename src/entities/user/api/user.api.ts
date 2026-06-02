import { glpiGet } from "../../../shared/api/glpiClient";
import type { User } from "../model/user.types";

export async function fetchCurrentUser(): Promise<User> {
  return glpiGet<User>("/me");
}
