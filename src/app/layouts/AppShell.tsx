import type { ReactNode } from "react";
import type { AppSectionId, NavigationItem } from "../config/navigation";
import {Moon, Sun, Settings, Bell} from "lucide-react"

type AppShellProps = {
  activeDescription: string;
  activeSection: AppSectionId;
  activeTitle: string;
  children: ReactNode;
  navigation: NavigationItem[];
  onNavigate: (section: AppSectionId) => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
};

function DashboardXLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-8 w-8">
        <span className="absolute left-0 top-3 h-2.5 w-2.5 rounded-full bg-(--accent-blue)" />
        <span className="absolute left-2.5 top-0 h-3.5 w-3.5 rounded-full bg-(--accent-blue)" />
        <span className="absolute right-0 top-1.5 h-2.5 w-2.5 rounded-full bg-(--accent-green)" />
        <span className="absolute left-3 top-4 h-3.5 w-3.5 rounded-full bg-(--accent-purple)" />
      </div>
      <span className="text-[2rem] font-semibold tracking-tight">GLPI New App</span>
    </div>
  );
}


export function AppShell({
  activeDescription,
  activeSection,
  activeTitle,
  children,
  navigation,
  onNavigate,
  onToggleTheme,
  theme,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-(--app-bg) text-(--text-primary) transition-colors duration-300 lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="flex flex-col bg-(--sidebar-bg) text-(--sidebar-text) transition-colors duration-300">
        <div className="px-6 pb-8 pt-8">
          <DashboardXLogo />
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4" aria-label="Sections principales">
          {navigation.map((item) => {
            const isActive = item.id === activeSection;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] transition ${
                  isActive
                    ? "bg-(--sidebar-active) text-(--accent-blue)"
                    : "text-(--sidebar-text-soft) hover:bg-(--sidebar-soft)"
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="shrink-0">
                  <Icon size={18} strokeWidth={1.7} />              
                </span>
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}

          <div className="mt-10 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--sidebar-text-muted)">
            Teams
          </div>

          <button className="mt-2 flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] text-(--sidebar-text-soft) hover:bg-(--sidebar-soft)">
            <span className="text-xl">◔</span>
            <span className="font-semibold">Message</span>
          </button>
          <button className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] text-(--sidebar-text-soft) hover:bg-(--sidebar-soft)">
            <span className="text-xl">◜</span>
            <span className="font-semibold">Support</span>
          </button>
        </nav>

      </aside>

      <main className="min-w-0">
        <header className="bg-(--panel-bg) px-5 py-7 transition-colors duration-300 lg:px-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[2rem] font-semibold tracking-tight text-(--text-primary)">
                  {activeTitle}
                </p>
                <p className="mt-1 text-sm text-(--text-secondary)">{activeDescription}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex h-14 items-center rounded-[20px] bg-(--panel-soft) px-4 text-sm font-semibold text-(--text-primary)"
                >
                  {theme === "light" ? <Moon /> : <Sun />}
                </button>

                <button className="relative flex h-12 w-12 items-center justify-center rounded-full text-(--text-secondary)">
                  <Bell />
                  <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-(--accent-blue) text-[10px] font-semibold text-white">
                    1
                  </span>
                </button>

                <button className="flex h-12 w-12 items-center justify-center rounded-full text-(--text-secondary)">
                  <Settings />
                </button>

                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-(--avatar-bg) text-lg">
                  🧔
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 pb-10 pt-2 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
              <span className="font-semibold text-(--text-primary)">{activeTitle}</span>
            </div>
          </div>

          <section className="grid grid-cols-12 gap-7">{children}</section>
        </div>
      </main>
    </div>
  );
}
