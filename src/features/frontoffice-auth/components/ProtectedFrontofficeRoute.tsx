import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { isFrontofficeAuthenticated } from "../lib/frontofficeAuth";

type ProtectedFrontofficeRouteProps = {
  children: ReactNode;
};

export function ProtectedFrontofficeRoute({ children }: ProtectedFrontofficeRouteProps) {
  const location = useLocation();

  if (!isFrontofficeAuthenticated()) {
    return <Navigate replace state={{ from: location.pathname }} to="/connexion" />;
  }

  return <>{children}</>;
}
