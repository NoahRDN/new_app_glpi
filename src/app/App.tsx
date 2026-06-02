import { useMemo, useState } from "react";
import { AppShell } from "./layouts/AppShell";
import { appNavigation, type AppSectionId } from "./config/navigation";
import { DashboardPage } from "../pages/DashboardPage";
import { TicketsPage } from "../pages/TicketsPage";
import { AssetsPage } from "../pages/AssetsPage";
import { KnowledgeBasePage } from "../pages/KnowledgeBasePage";

function renderSection(section: AppSectionId) {
  switch (section) {
    case "dashboard":
      return <DashboardPage />;
    case "tickets":
      return <TicketsPage />;
    case "assets":
      return <AssetsPage />;
    case "knowledge-base":
      return <KnowledgeBasePage />;
    default:
      return <DashboardPage />;
  }
}

export function App() {
  const [activeSection, setActiveSection] = useState<AppSectionId>("dashboard");

  const activeItem = useMemo(
    () => appNavigation.find((item) => item.id === activeSection) ?? appNavigation[0],
    [activeSection]
  );

  return (
    <AppShell
      activeSection={activeSection}
      activeTitle={activeItem.label}
      activeDescription={activeItem.description}
      navigation={appNavigation}
      onNavigate={setActiveSection}
    >
      {renderSection(activeSection)}
    </AppShell>
  );
}
