import { frontOfficeNavigation } from "../config/frontOfficeNavigation";
import { OfficeLayoutShell } from "./OfficeLayoutShell";

export function FrontOfficeLayout() {
  return (
    <OfficeLayoutShell
      navigation={frontOfficeNavigation}
      officeLabel="Frontoffice"
      subtitle="Portail utilisateur"
    />
  );
}
