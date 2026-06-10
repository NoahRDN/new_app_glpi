import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { useCreateComputer } from "../hooks/useCreateComputer";
import type { CreateComputer } from "../../../../entities/computer/model/computer.types";
import { Label } from "../../../../shared/ui/Label";

type CreateComputerFormProps = {
  onCreated?: () => void;
  onClose?: () => void;
};

export function CreateComputerForm({ onCreated, onClose}: CreateComputerFormProps) {
  const [form, setForm] = useState<CreateComputer>({
    name: "",
  });

  const {
    mutateAsync: createComputerAsync,
    isPending: isCreatingComputer,
    isError: isCreateComputerError,
    error: createComputerError,
  } = useCreateComputer();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();

    if (name.length === 0) {
      return;
    }

    await createComputerAsync({
      ...form,
      name,
    });

    setForm({
      name: "",
    });

    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="computerName">Nom de l'ordinateur: </Label>
      <Input
        id="computerName"
        placeholder="Nom de l’ordinateur"
        value={form.name}
        onChange={(event) => {
          setForm((currentForm) => ({
            ...currentForm,
            name: event.target.value,
          }));
        }}
      />

      {isCreateComputerError && (
        <div className="text-red-500">
          {getUserErrorMessage(
            createComputerError,
            "Impossible de créer l’ordinateur.",
          )}
        </div>
      )}
      <div className="flex gap-3">
        <Button 
          type="button"
          className="w-full flex items-center flex-col" 
          isWithBackground={false}
          onClick={onClose} 
        >
          Annuler
        </Button>

        <Button type="submit" className="w-full flex items-center flex-col"  disabled={isCreatingComputer}>
          {isCreatingComputer ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
}