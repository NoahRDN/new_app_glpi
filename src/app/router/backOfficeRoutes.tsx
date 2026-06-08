import type { RouteObject } from "react-router";
import { BackOfficeLayout } from "../layouts/BackOfficeLayout";
import { ProtectedBackofficeRoute } from "../../features/backoffice-auth/components/ProtectedBackofficeRoute";
import { DashboardPage } from "../../pages/other/backoffice/DashboardPage";
import { TicketsPage } from "../../pages/other/backoffice/TicketsPage";
import { ParcsPage } from "../../pages/other/backoffice/ParcPage";
import { KnowledgeBasePage } from "../../pages/other/backoffice/KnowledgeBasePage";
import { UsersPage } from "../../pages/backoffice/UsersPage";
import { ImportDataPage } from "../../pages/backoffice/ImportDataPage";
import { ResetDataPage } from "../../pages/backoffice/ResetDataPage";
import { LoginPage } from "../../pages/backoffice/LoginPage";
import { AssetsPage } from "../../pages/backoffice/AssetsPage";
import { ComputerPage } from "../../pages/backoffice/ComputerPage";
import { PrinterPage } from "../../pages/backoffice/PrinterPage";
import { MemoTest } from "../../pages/other/backoffice/MemoTest";

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
          path: "parcs",
          element: <ParcsPage />,
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
          path: "computers",
          element: <ComputerPage />,
        },
        {
          path: "printers",
          element: <PrinterPage />,
        },
        {
          path: "assets",
          element: <AssetsPage />,
        },
        {
          path: "import-data",
          element: <ImportDataPage />,
        },
        {
          path: "reset-data",
          element: <ResetDataPage />,
        },
        {
          path: "memo-test",
          element: <MemoTest />,
        },
        
      ],
    },
  ],
};
