import { useNavigate } from "react-router";
import { frontOfficeNavigation } from "../../config/frontOfficeNavigation";
import { OfficeLayoutShell } from "./OfficeLayoutShell";
import { Button } from "../../../shared/ui/Button";
import { signOutFrontoffice } from "../../../features/frontoffice-auth/lib/frontofficeAuth";

export function FrontOfficeLayout() {
  const navigate = useNavigate();

  return (
    <OfficeLayoutShell
      actions={(
        <Button
          isWithBackground={false}
          type="button"
          onClick={() => {
            signOutFrontoffice();
            navigate("/connexion", { replace: true });
          }}
        >
          Déconnexion
        </Button>
      )}
      navigation={frontOfficeNavigation}
      officeLabel="Frontoffice"
      subtitle="Portail utilisateur"
    />
  );
}
