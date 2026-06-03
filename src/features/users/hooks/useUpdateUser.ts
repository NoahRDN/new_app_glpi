import { useState } from "react";
import { updateUser } from "../../../entities/user/api/user.api";
import type { UpdateUser, User } from "../../../entities/user/model/user.types";

export function useUpdateUser(initialUser: User) {
  const [user, setUser] = useState<UpdateUser>({
    id: initialUser.id,
    firstname: initialUser.firstname,
    realname: initialUser.realname,
    username: initialUser.username,
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>("");

  async function updateUserHook(): Promise<User | undefined> {
    try {
      setIsSuccess(false);
      setIsUpdating(true);
      setError("");

      const updatedUser = await updateUser(user);

      if (updatedUser) {
        setIsSuccess(true);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur pendant la modification de l'utilisateur.");
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    error,
    isSuccess,
    isUpdating,
    setUser,
    updateUserHook,
    user,
  };
}
