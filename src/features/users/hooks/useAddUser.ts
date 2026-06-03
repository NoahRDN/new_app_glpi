import { useState } from "react";
import type { CreateUser } from "../../../entities/user/model/user.types";
import { createUser } from "../../../entities/user/api/user.api";

export function useAddUser() {
  const [user, setUser] = useState<CreateUser>({
    firstname:"first name new app" ,
    realname: "real name new app",
    username:"username new app",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  async function addUser() {
    try {
      setIsAdding(true);
      setError("");

      console.log("Utilisateur à envoyer :", user);

      const createdUser = await createUser(user);
      console.log("===============");
      console.log("Utilisateur créé :", createdUser);

    } catch (error) {
      console.error(error);
      setError("Erreur pendant l'ajout de l'utilisateur.");
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
  };
}