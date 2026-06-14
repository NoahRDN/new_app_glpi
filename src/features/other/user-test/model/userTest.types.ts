export type UserTest = {
  id: number;
  nom: string;
  prenom: string;
  dateDeNaissance: string;
  favoriteNumber: number;
  dateAdd: string;
  dateUpdate: string;
  deleted: boolean;
};

export type CreateUserTest = {
  dateDeNaissance: string;
  favoriteNumber: number;
  nom: string;
  prenom: string;
};

export type UpdateUserTest = Partial<CreateUserTest>;

export const createUserTestDefaultValues: CreateUserTest = {
  dateDeNaissance: "",
  favoriteNumber: 0,
  nom: "",
  prenom: "",
};
