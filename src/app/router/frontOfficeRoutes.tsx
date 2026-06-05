import type { RouteObject } from "react-router";
import { FrontOfficeLayout } from "./layouts/FrontOfficeLayout";
import { ProtectedFrontofficeRoute } from "../../features/frontoffice-auth/components/ProtectedFrontofficeRoute";
import { HomePage } from "../../pages/frontoffice/HomePage";
import { PortalPage } from "../../pages/frontoffice/PortalPage";
import { HelpCenterPage } from "../../pages/frontoffice/HelpCenterPage";
import { LoginPage } from "../../pages/frontoffice/LoginPage";
import { AccountPage } from "../../pages/frontoffice/AccountPage";

export const frontOfficeRoutes: RouteObject = {
  children: [
    {
      path: "/connexion",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedFrontofficeRoute>
          <FrontOfficeLayout />
        </ProtectedFrontofficeRoute>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "portal",
          element: <PortalPage />,
        },
        {
          path: "help-center",
          element: <HelpCenterPage />,
        },
        {
          path: "account",
          element: <AccountPage />,
        },
      ],
    },
  ],
};
