import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Label } from "../../../../shared/ui/Label";
import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { useUpdatePrinter } from "../hooks/useUpdatePrinter";
import type { Printer, UpdatePrinter } from "../../../../entities/printer/model/printer.types";

type UpdatePrinterFormProps = {
  onClose?: () => void;
  onUpdated?: () => void;
  printer: Printer;
};

export function UpdatePrinterForm({
  onClose,
  onUpdated,
  printer,
}: UpdatePrinterFormProps) {
  const [form, setForm] = useState<UpdatePrinter>({
    id: printer.id,
    name: printer.name ?? "",
  });

  const {
    mutateAsync: updatePrinterAsync,
    isPending: isUpdatingPrinter,
    isError: isUpdatePrinterError,
    error: updatePrinterError,
  } = useUpdatePrinter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name?.trim();

    if (!name) {
      return;
    }

    await updatePrinterAsync({
      ...form,
      name,
    });

    onUpdated?.();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Label htmlFor="printerNameUpdate">Nom de l'imprimante :</Label>
      <Input
        id="printerNameUpdate"
        placeholder="Nom de l’imprimante"
        value={form.name}
        onChange={(event) => {
          setForm((currentForm) => ({
            ...currentForm,
            name: event.target.value,
          }));
        }}
      />

      {isUpdatePrinterError && (
        <div className="text-red-500">
          {getUserErrorMessage(
            updatePrinterError,
            "Impossible de modifier l’imprimante.",
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          isWithBackground={false}
          className="w-full flex items-center flex-col"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="w-full flex items-center flex-col"
          disabled={isUpdatingPrinter}
        >
          {isUpdatingPrinter ? "Modification..." : "Modifier"}
        </Button>
      </div>
    </form>
  );
}
