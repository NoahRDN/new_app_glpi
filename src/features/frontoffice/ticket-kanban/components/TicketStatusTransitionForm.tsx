import { useState } from "react";
import { getDeveloperErrorDetails, getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { MyError } from "../../../../shared/ui/MyError";
import { Textarea } from "../../../../shared/ui/Textarea";

export type TicketStatusTransitionMode =
  | "resolve"
  | "approve"
  | "refuse"
  | "reopen";

type TicketStatusTransitionFormProps = {
  isPending?: boolean;
  mode: TicketStatusTransitionMode;
  onClose: () => void;
  onSubmit: (values: { comment: string }) => Promise<void> | void;
  submitError?: unknown;
};

function getModeConfig(mode: TicketStatusTransitionMode) {
  if (mode === "resolve") {
    return {
      buttonLabel: "Résoudre le ticket",
      description: "Saisissez la solution appliquée avant de passer le ticket à l'état résolu.",
      fieldLabel: "Solution",
      isRequired: true,
      placeholder: "Décrivez la solution apportée...",
      title: "Saisir une solution",
    };
  }

  if (mode === "approve") {
    return {
      buttonLabel: "Approuver et clôturer",
      description: "Vous pouvez ajouter un commentaire d'approbation avant de clôturer le ticket.",
      fieldLabel: "Commentaire d'approbation",
      isRequired: false,
      placeholder: "Commentaire optionnel...",
      title: "Approuver la solution",
    };
  }

  if (mode === "refuse") {
    return {
      buttonLabel: "Refuser et rouvrir",
      description: "Une raison est obligatoire pour refuser la solution et repasser le ticket en cours.",
      fieldLabel: "Raison du refus",
      isRequired: true,
      placeholder: "Expliquez pourquoi la solution est refusée...",
      title: "Refuser la solution",
    };
  }

  return {
    buttonLabel: "Rouvrir le ticket",
    description: "Expliquez pourquoi le ticket doit être rouvert.",
    fieldLabel: "Raison de réouverture",
    isRequired: true,
    placeholder: "Décrivez la raison de réouverture...",
    title: "Raison de réouverture",
  };
}

export function TicketStatusTransitionForm({
  isPending = false,
  mode,
  onClose,
  onSubmit,
  submitError,
}: TicketStatusTransitionFormProps) {
  const [comment, setComment] = useState("");
  const [isRequirementSatisfied, setIsRequirementSatisfied] = useState(true);
  const config = getModeConfig(mode);
  const hasSubmitError = submitError !== undefined && submitError !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedComment = comment.trim();
    const isSatisfied = !config.isRequired || trimmedComment.length > 0;

    setIsRequirementSatisfied(isSatisfied);

    if (!isSatisfied) {
      return;
    }

    await onSubmit({
      comment: trimmedComment,
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <p className="text-lg font-semibold text-(--text-primary)">{config.title}</p>
        <p className="mt-1 text-sm text-(--text-secondary)">{config.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`ticket-transition-${mode}`}>{config.fieldLabel}</Label>
        <Textarea
          id={`ticket-transition-${mode}`}
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setIsRequirementSatisfied(
              !config.isRequired || event.target.value.trim().length > 0,
            );
          }}
          placeholder={config.placeholder}
        />
      </div>

      {!isRequirementSatisfied && (
        <MyError>
          {config.fieldLabel} est obligatoire pour cette transition.
        </MyError>
      )}

      {hasSubmitError && (
        <MyError>
          <p>{getUserErrorMessage(submitError, "Impossible d'effectuer cette transition.")}</p>
          {import.meta.env.DEV && (
            <pre className="mt-4 whitespace-pre-wrap rounded bg-red-100 p-3 text-xs">
              {getDeveloperErrorDetails(submitError)}
            </pre>
          )}
        </MyError>
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
        <Button
          type="submit"
          className="w-full flex items-center flex-col"
          disabled={isPending}
        >
          {isPending ? "Traitement..." : config.buttonLabel}
        </Button>
      </div>
    </form>
  );
}
