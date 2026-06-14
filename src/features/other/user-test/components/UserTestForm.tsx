import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { MyError } from "../../../../shared/ui/MyError";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import {
  createUserTestDefaultValues,
  type CreateUserTest,
} from "../model/userTest.types";

type UserTestFormProps = {
  initialValues?: CreateUserTest;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateUserTest) => Promise<void> | void;
  submitError?: unknown;
  submitLabel: string;
};

function getInitialFormValues(initialValues?: CreateUserTest): CreateUserTest {
  return initialValues ?? createUserTestDefaultValues;
}

export function UserTestForm({
  initialValues,
  isPending = false,
  onCancel,
  onSubmit,
  submitError,
  submitLabel,
}: UserTestFormProps) {
  const [values, setValues] = useState<CreateUserTest>(
    getInitialFormValues(initialValues),
  );

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      {Boolean(submitError) && (
        <MyError className="rounded-2xl p-3">
          {getUserErrorMessage(submitError, "Erreur lors de l'enregistrement", true)}
        </MyError>
      )}

      <div className="space-y-2">
        <Label htmlFor="user-test-nom">Nom</Label>
        <Input
          id="user-test-nom"
          value={values.nom}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              nom: event.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-test-prenom">Prénom</Label>
        <Input
          id="user-test-prenom"
          value={values.prenom}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              prenom: event.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-test-date-naissance">Date de naissance</Label>
        <Input
          id="user-test-date-naissance"
          type="date"
          value={values.dateDeNaissance}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              dateDeNaissance: event.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-test-favorite-number">Favorite number</Label>
        <Input
          id="user-test-favorite-number"
          type="number"
          value={values.favoriteNumber}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              favoriteNumber: Number(event.target.value),
            }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="justify-center bg-red-600"
          type="button"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          className="justify-center"
          disabled={
            isPending ||
            values.nom.trim() === "" ||
            values.prenom.trim() === "" ||
            values.dateDeNaissance.trim() === ""
          }
          type="submit"
        >
          {isPending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
