import type { ReactNode } from "react";
import type { AppSectionId, NavigationItem } from "../config/navigation";
import {Search} from "lucide-react"

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
        <span className="absolute left-0 top-3 h-2.5 w-2.5 rounded-full bg-[var(--accent-blue)]" />
        <span className="absolute left-2.5 top-0 h-3.5 w-3.5 rounded-full bg-[var(--accent-blue)]" />
        <span className="absolute right-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent-green)]" />
        <span className="absolute left-3 top-4 h-3.5 w-3.5 rounded-full bg-[var(--accent-purple)]" />
      </div>
      <span className="text-[2rem] font-semibold tracking-tight">GLPI New App</span>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4C9.5 4 8 5.8 8 8.5V10.2C8 11.1 7.6 12.3 7.1 13L6 14.8C5.3 16 5.8 17.3 7.2 17.8C11.8 19.3 12.2 19.3 16.8 17.8C18.2 17.3 18.7 16 18 14.8L16.9 13C16.4 12.3 16 11.1 16 10.2V8.5C16 5.8 14.5 4 12 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M10.5 20C11.4 21 12.8 21 13.7 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8.8A3.2 3.2 0 1 0 12 15.2A3.2 3.2 0 1 0 12 8.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 12L5.8 11.4C6.1 10.7 6.2 10.4 6.5 9.8L5.9 8L7.9 6L9.7 6.6C10.3 6.3 10.6 6.2 11.3 5.9L12 4H12.1L12.8 5.9C13.5 6.2 13.8 6.3 14.4 6.6L16.2 6L18.2 8L17.6 9.8C17.9 10.4 18 10.7 18.3 11.4L20 12L18.3 12.6C18 13.3 17.9 13.6 17.6 14.2L18.2 16L16.2 18L14.4 17.4C13.8 17.7 13.5 17.8 12.8 18.1L12.1 20H12L11.3 18.1C10.6 17.8 10.3 17.7 9.7 17.4L7.9 18L5.9 16L6.5 14.2C6.2 13.6 6.1 13.3 5.8 12.6L4 12Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-2000 lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="flex flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] transition-colors duration-300">
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
                    ? "bg-[var(--sidebar-active)] text-[var(--accent-blue)]"
                    : "text-[var(--sidebar-text-soft)] hover:bg-[var(--sidebar-soft)]"
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

          <div className="mt-10 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sidebar-text-muted)]">
            Teams
          </div>

          <button className="mt-2 flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] text-[var(--sidebar-text-soft)] hover:bg-[var(--sidebar-soft)]">
            <span className="text-xl">◔</span>
            <span className="font-semibold">Message</span>
          </button>
          <button className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] text-[var(--sidebar-text-soft)] hover:bg-[var(--sidebar-soft)]">
            <span className="text-xl">◜</span>
            <span className="font-semibold">Support</span>
          </button>
        </nav>

      </aside>

      <main className="min-w-0">
        <header className="bg-[var(--panel-bg)] px-5 py-7 transition-colors duration-300 lg:px-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[2rem] font-semibold tracking-tight text-[var(--text-primary)]">
                  {activeTitle}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{activeDescription}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 min-w-[300px] items-center gap-3 rounded-[20px] bg-[var(--panel-soft)] px-5 text-[var(--text-secondary)]">
                <input
                  className="w-full border-0 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  placeholder="Search..."
                />
                <Search />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex h-14 items-center rounded-[20px] bg-[var(--panel-soft)] px-4 text-sm font-semibold text-[var(--text-primary)]"
                >
                  {theme === "light" ? "Dark" : "Light"}
                </button>

                <button className="relative flex h-12 w-12 items-center justify-center rounded-full text-[var(--text-secondary)]">
                  <BellIcon />
                  <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--accent-blue)] text-[10px] font-semibold text-white">
                    1
                  </span>
                </button>

                <button className="flex h-12 w-12 items-center justify-center rounded-full text-[var(--text-secondary)]">
                  <SettingsIcon />
                </button>

                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--avatar-bg)] text-lg">
                  🧔
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 pb-10 pt-2 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{activeTitle}</span>
            </div>

            <button className="inline-flex items-center gap-3 rounded-[18px] bg-[var(--accent-blue)] px-5 py-4 text-sm font-semibold text-white shadow-sm">
              <DownloadIcon />
              Generate Report
            </button>
          </div>

          <section className="grid grid-cols-12 gap-7">{children}</section>
        </div>
      </main>
    </div>
  );
}
