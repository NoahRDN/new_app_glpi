import { Navigate, Route, Routes } from "react-router";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { TicketsPage } from "../pages/TicketsPage";
import { AssetsPage } from "../pages/AssetsPage";
import { KnowledgeBasePage } from "../pages/KnowledgeBasePage";
import { UsersPage } from "../pages/UsersPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}