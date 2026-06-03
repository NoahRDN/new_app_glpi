import { useState } from "react";
import type { CreateUser, User } from "../../../entities/user/model/user.types";
import { createUser } from "../../../entities/user/api/user.api";

export function useAddUser() {
  const [user, setUser] = useState<CreateUser>({
    firstname:"first name new app" ,
    realname: "real name new app",
    username:"username new app",
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string>("");

  async function addUser() : Promise<User | undefined | unknown> {
    try {
        setIsSuccess(false);
        setIsAdding(true);
        setError("");

      const createdUser = await createUser(user);

      if (createdUser) {
        setIsSuccess(true);
      }

      return createUser;

    } catch (error) {
        if(error instanceof Error){
            setError(error.message)
        } else{
            setError("Erreur pendant l'ajout de l'utilisateur.");
        }
    } finally {
      setIsAdding(false);
    }
  }

  

  return {
    user,
    setUser,
    isAdding,
    error,
    addUser,
    isSuccess
  };
}