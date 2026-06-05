import type { RouteObject } from "react-router";
import { BackOfficeLayout } from "./layouts/BackOfficeLayout";
import { ProtectedBackofficeRoute } from "../../features/backoffice-auth/components/ProtectedBackofficeRoute";
import { DashboardPage } from "../../pages/backoffice/DashboardPage";
import { TicketsPage } from "../../pages/backoffice/TicketsPage";
import { AssetsPage } from "../../pages/backoffice/AssetsPage";
import { KnowledgeBasePage } from "../../pages/backoffice/KnowledgeBasePage";
import { UsersPage } from "../../pages/backoffice/UsersPage";
import { ImportDataPage } from "../../pages/backoffice/ImportDataPage";
import { ResetDataPage } from "../../pages/backoffice/ResetDataPage";
import { LoginPage } from "../../pages/backoffice/LoginPage";

export const backOfficeRoutes: RouteObject = {
  children: [
    {
      path: "/admin/connexion",
      element: <LoginPage />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedBackofficeRoute>
          <BackOfficeLayout />
        </ProtectedBackofficeRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "tickets",
          element: <TicketsPage />,
        },
        {
          path: "assets",
          element: <AssetsPage />,
        },
        {
          path: "knowledge-base",
          element: <KnowledgeBasePage />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "import-data",
          element: <ImportDataPage />,
        },
        {
          path: "reset-data",
          element: <ResetDataPage />,
        },
      ],
    },
  ],
};
