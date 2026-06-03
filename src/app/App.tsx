import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./layouts/AppShell";
import { appNavigation, type AppSectionId } from "./config/navigation";
import { DashboardPage } from "../pages/DashboardPage";
import { TicketsPage } from "../pages/TicketsPage";
import { AssetsPage } from "../pages/AssetsPage";
import { KnowledgeBasePage } from "../pages/KnowledgeBasePage";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "new-app-glpi-theme";

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
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" ? "dark" : "light";
  });
  
  const activeItem = useMemo(
    () => appNavigation.find((item) => item.id === activeSection) ?? appNavigation[0],
    [activeSection]
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  return (
    <AppShell
      activeSection={activeSection}
      activeTitle={activeItem.label}
      activeDescription={activeItem.description}
      navigation={appNavigation}
      onNavigate={setActiveSection}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {renderSection(activeSection)}
    </AppShell>
  );
}
