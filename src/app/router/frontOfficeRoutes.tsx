import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { FrontOfficeLayout } from "../layouts/FrontOfficeLayout";
import { PortalPage } from "../../pages/other/frontoffice/PortalPage";
import { HelpCenterPage } from "../../pages/other/frontoffice/HelpCenterPage";
import { AccountPage } from "../../pages/other/frontoffice/AccountPage";
import { GeneralViewElementPage } from "../../pages/frontoffice/GeneralViewElementPage";
import { TicketsPage } from "../../pages/frontoffice/TicketsPage";
import { TicketsKanbanPage } from "../../pages/frontoffice/TicketsKanbanPage";

export const frontOfficeRoutes: RouteObject = {
  children: [
    {
      path: "/connexion",
      element: <Navigate replace to="/" />,
    },
    {
      path: "/",
      element: <FrontOfficeLayout />,
      children: [
        {
          index: true,
          element: <GeneralViewElementPage />,
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
        {
          path: "ticket-kanban",
          element: <TicketsKanbanPage />,
        },
      ],
    },
  ],
};
