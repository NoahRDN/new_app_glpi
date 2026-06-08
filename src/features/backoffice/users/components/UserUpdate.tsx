import type { ComponentPropsWithoutRef } from "react";
import type { User } from "../../../../entities/user/model/user.types";
import { Button } from "../../../../shared/ui/Button";
import { MyError } from "../../../../shared/ui/MyError";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { Success } from "../../../../shared/ui/Succcess";
import { useUpdateUser } from "../hooks/useUpdateUser";

type UserUpdateProps = {
  onClose: () => void;
  onUserUpdated: () => void;
  userToUpdate: User;
};

type FormSubmitHandler = NonNullable<ComponentPropsWithoutRef<"form">["onSubmit"]>;

export function UserUpdate({ onClose, onUserUpdated, userToUpdate }: UserUpdateProps) {
  const { user, setUser, isUpdating, updateUserHook, error, isSuccess } = useUpdateUser(userToUpdate);

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();

    const updatedUser = await updateUserHook();

    if (updatedUser) {
      onUserUpdated();
      onClose();
    }
  };

  return (
    <div className="flex items-center gap-3 flex-col">
      {error !== "" && <MyError>{error}</MyError>}
      {isSuccess && <Success>Utilisateur modifié avec succès</Success>}

      <form className="flex gap-3 flex-col w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="update-username">Username: </Label>
          <Input
            id="update-username"
            type="text"
            value={user.username}
            onChange={(event) =>
              setUser({
                ...user,
                username: event.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="update-firstname">First Name: </Label>
          <Input
            id="update-firstname"
            type="text"
            value={user.firstname}
            onChange={(event) =>
              setUser({
                ...user,
                firstname: event.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="update-realname">Real Name: </Label>
          <Input
            id="update-realname"
            type="text"
            value={user.realname}
            onChange={(event) =>
              setUser({
                ...user,
                realname: event.target.value,
              })
            }
          />
        </div>

        <div className="flex gap-3 justify-between">
          <Button
            otherClassName="w-full flex items-center flex-col"
            isWithBackground={false}
            onClick={onClose}
            type="button"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            otherClassName="w-full flex items-center flex-col"
            disabled={isUpdating}
          >
            {isUpdating ? "Modification...." : "Modifier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
