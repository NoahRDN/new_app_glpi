import { useNavigate } from "react-router";
import { backOfficeNavigation } from "../../config/backOfficeNavigation";
import { OfficeLayoutShell } from "./OfficeLayoutShell";
import { Button } from "../../../shared/ui/Button";
import { signOutBackoffice } from "../../../features/backoffice-auth/lib/backofficeAuth";

export function BackOfficeLayout() {
  const navigate = useNavigate();

  return (
    <OfficeLayoutShell
      actions={(
        <Button
          isWithBackground={false}
          type="button"
          onClick={() => {
            signOutBackoffice();
            navigate("/admin/connexion", { replace: true });
          }}
        >
          Déconnexion
        </Button>
      )}
      navigation={backOfficeNavigation}
      officeLabel="Backoffice"
    />
  );
}
