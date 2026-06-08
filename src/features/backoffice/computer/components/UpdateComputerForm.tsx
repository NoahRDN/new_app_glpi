import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import  { useUpdateComputer } from "../hooks/useUpdateComputer";
import type {
  Computer,
  UpdateComputer,
} from "../../../../entities/computer/model/computer.types";

type UpdateComputerFormProps = {
  computer: Computer;
  onUpdated?: () => void;
  onClose?: () => void;
};

export function UpdateComputerForm({
  computer,
  onUpdated,
  onClose,
}: UpdateComputerFormProps) {
  const [form, setForm] = useState<UpdateComputer>({
    id: computer.id,
    name: computer.name ?? "",
  });

  const {
    mutateAsync: updateComputerAsync,
    isPending: isUpdatingComputer,
    isError: isUpdateComputerError,
    error: updateComputerError,
  } = useUpdateComputer();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form?.name?.trim();

    if (!name || name.length === 0) {
      return;
    }

    await updateComputerAsync({
      ...form,
      name,
    });

    onUpdated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      <Label htmlFor="computerName">Nom de l'ordinateur :</Label>

      <Input
        id="computerName"
        name="computerName"
        autoComplete="off"
        placeholder="Nom de l’ordinateur"
        value={form.name}
        onChange={(event) => {
          setForm((currentForm) => ({
            ...currentForm,
            name: event.target.value,
          }));
        }}
      />

      {isUpdateComputerError && (
        <div className="text-red-500">
          {getUserErrorMessage(
            updateComputerError,
            "Impossible de modifier l’ordinateur.",
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          otherClassName="w-full flex items-center flex-col"
          isWithBackground={false}
          onClick={onClose}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          otherClassName="w-full flex items-center flex-col"
          disabled={isUpdatingComputer}
        >
          {isUpdatingComputer ? "Modification..." : "Modifier"}
        </Button>
      </div>
    </form>
  );
}