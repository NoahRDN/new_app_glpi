import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { useCreatePrinter } from "../hooks/useCreatePrinter";
import type { CreatePrinter } from "../../../../entities/printer/model/printer.types";

type CreatePrinterFormProps = {
  onClose?: () => void;
  onCreated?: () => void;
};

export function CreatePrinterForm({ onClose, onCreated }: CreatePrinterFormProps) {
  const [form, setForm] = useState<CreatePrinter>({
    name: "",
  });

  const {
    mutateAsync: createPrinterAsync,
    isPending: isCreatingPrinter,
    isError: isCreatePrinterError,
    error: createPrinterError,
  } = useCreatePrinter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();

    if (name.length === 0) {
      return;
    }

    await createPrinterAsync({
      ...form,
      name,
    });

    setForm({ name: "" });
    onCreated?.();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Label htmlFor="printerName">Nom de l'imprimante :</Label>
      <Input
        id="printerName"
        placeholder="Nom de l’imprimante"
        value={form.name}
        onChange={(event) => {
          setForm((currentForm) => ({
            ...currentForm,
            name: event.target.value,
          }));
        }}
      />

      {isCreatePrinterError && (
        <div className="text-red-500">
          {getUserErrorMessage(
            createPrinterError,
            "Impossible de créer l’imprimante.",
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          isWithBackground={false}
          otherClassName="w-full flex items-center flex-col"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          otherClassName="w-full flex items-center flex-col"
          disabled={isCreatingPrinter}
        >
          {isCreatingPrinter ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
}
