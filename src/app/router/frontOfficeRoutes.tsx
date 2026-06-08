import type { RouteObject } from "react-router";
import { FrontOfficeLayout } from "../layouts/FrontOfficeLayout";
import { ProtectedFrontofficeRoute } from "../../features/frontoffice-auth/components/ProtectedFrontofficeRoute";
import { HomePage } from "../../pages/other/frontoffice/HomePage";
import { PortalPage } from "../../pages/other/frontoffice/PortalPage";
import { HelpCenterPage } from "../../pages/other/frontoffice/HelpCenterPage";
import { LoginPage } from "../../pages/other/frontoffice/LoginPage";
import { AccountPage } from "../../pages/other/frontoffice/AccountPage";
import { GeneralViewElementPage } from "../../pages/frontoffice/GeneralViewElementPage";
import { TicketsPage } from "../../pages/frontoffice/TicketsPage";

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
        {
          path: "asset-general-element",
          element: <GeneralViewElementPage />,
        },
        {
          path: "create-ticket",
          element: <TicketsPage />,
        },
      ],
    },
  ],
};