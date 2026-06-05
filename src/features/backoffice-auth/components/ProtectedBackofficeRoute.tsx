import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { isBackofficeAuthenticated } from "../lib/backofficeAuth";

type ProtectedBackofficeRouteProps = {
  children: ReactNode;
};

export function ProtectedBackofficeRoute({ children }: ProtectedBackofficeRouteProps) {
  const location = useLocation();

  if (!isBackofficeAuthenticated()) {
    return <Navigate replace state={{ from: location.pathname }} to="/admin/connexion" />;
  }

  return <>{children}</>;
}
