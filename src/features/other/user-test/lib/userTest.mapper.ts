import type { CreateUserTest, UserTest } from "../model/userTest.types";

export function mapUserTestToFormValues(
  userTest: UserTest
): CreateUserTest {
  return {
    dateDeNaissance: userTest.dateDeNaissance,
    favoriteNumber: userTest.favoriteNumber,
    nom: userTest.nom,
    prenom: userTest.prenom,
  };
}