import { useState } from "react";
import { getDeveloperErrorDetails, getUserErrorMessage } from "../../../../shared/errors/AppError";
import { Button } from "../../../../shared/ui/Button";
import { Label } from "../../../../shared/ui/Label";
import { MyError } from "../../../../shared/ui/MyError";
import { Textarea } from "../../../../shared/ui/Textarea";

type TicketResolvedReviewFormProps = {
  isPending?: boolean;
  onApprove: (values: { comment: string }) => Promise<void> | void;
  onClose: () => void;
  onRefuse: (values: { comment: string }) => Promise<void> | void;
  submitError?: unknown;
};

export function TicketResolvedReviewForm({
  isPending = false,
  onApprove,
  onClose,
  onRefuse,
  submitError,
}: TicketResolvedReviewFormProps) {
  const [comment, setComment] = useState("");
  const [isRefuseRequirementSatisfied, setIsRefuseRequirementSatisfied] = useState(true);
  const hasSubmitError = submitError !== undefined && submitError !== null;

  async function handleApprove() {
    await onApprove({
      comment: comment.trim(),
    });
  }

  async function handleRefuse() {
    const trimmedComment = comment.trim();
    const isSatisfied = trimmedComment.length > 0;

    setIsRefuseRequirementSatisfied(isSatisfied);

    if (!isSatisfied) {
      return;
    }

    await onRefuse({
      comment: trimmedComment,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-lg font-semibold text-(--text-primary)">Approuver ou refuser la solution</p>
        <p className="mt-1 text-sm text-(--text-secondary)">
          Validez la solution pour clôturer le ticket, ou refusez-la avec une raison obligatoire pour le repasser en cours.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-resolved-review-comment">
          Commentaire d&apos;approbation ou raison du refus
        </Label>
        <Textarea
          id="ticket-resolved-review-comment"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setIsRefuseRequirementSatisfied(event.target.value.trim().length > 0);
          }}
          placeholder="Commentaire optionnel pour valider, obligatoire pour refuser..."
        />
      </div>

      {!isRefuseRequirementSatisfied && (
        <MyError>
          Une raison est obligatoire pour refuser la solution.
        </MyError>
      )}

      {hasSubmitError && (
        <MyError>
          <p>{getUserErrorMessage(submitError, "Impossible de traiter la décision sur la solution.")}</p>
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
          type="button"
          className="w-full flex items-center flex-col"
          isWithBackground={false}
          disabled={isPending}
          onClick={handleRefuse}
        >
          {isPending ? "Traitement..." : "Refuser"}
        </Button>
        <Button
          type="button"
          className="w-full flex items-center flex-col"
          disabled={isPending}
          onClick={handleApprove}
        >
          {isPending ? "Traitement..." : "Valider"}
        </Button>
      </div>
    </div>
  );
}
