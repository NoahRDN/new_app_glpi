import type { ReactNode } from "react";
import type { AppSectionId, NavigationItem } from "../config/navigation";
import { SessionStatus } from "../../features/session-status/components/SessionStatus";

type AppShellProps = {
  activeDescription: string;
  activeSection: AppSectionId;
  activeTitle: string;
  children: ReactNode;
  navigation: NavigationItem[];
  onNavigate: (section: AppSectionId) => void;
};

export function AppShell({
  activeDescription,
  activeSection,
  activeTitle,
  children,
  navigation,
  onNavigate,
}: AppShellProps) {
  const activeNav = navigation.find((item) => item.id === activeSection);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="flex flex-col bg-[#31456f] text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[2.2rem] font-semibold italic tracking-tight">New App GLPI</p>
        </div>

        <div className="px-4 py-4">
          <button
            type="button"
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-[15px] text-white/90 transition hover:bg-white/8"
          >
            Chercher dans le menu
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 pb-6" aria-label="Sections principales">
          <div className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Configuration
          </div>

          {navigation.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition ${
                  isActive ? "bg-[#3b5182] text-white" : "text-white/85 hover:bg-white/8"
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-white/10 text-[11px] font-semibold text-white/90">
                  {item.shortKey}
                </span>
                <span>
                  <strong className="block font-semibold">{item.label}</strong>
                  <small className="block text-xs leading-5 text-white/55">{item.description}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pb-4">
          <SessionStatus />
        </div>
      </aside>

      <main className="min-w-0">
        <header className="border-b border-slate-200 bg-white px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Accueil</span>
              <span>/</span>
              <span>Configuration</span>
              <span>/</span>
              <span className="font-medium text-slate-700">{activeNav?.label ?? activeTitle}</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-10 min-w-[280px] items-center rounded-md border border-slate-200 bg-slate-50 px-3">
                <input
                  className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400"
                  placeholder="Rechercher"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">Super-Admin</p>
                  <p className="text-xs text-slate-500">Entite racine</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ef7e56] font-semibold text-white">
                  GL
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 lg:px-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center rounded-md bg-slate-200 px-3 py-1 text-sm text-slate-600">
                Client OAuth - {activeTitle}
              </div>
              <p className="mt-2 text-sm text-slate-500">{activeDescription}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                Actions
              </button>
              <button className="rounded-md bg-[#f7bf56] px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                + Ajouter
              </button>
            </div>
          </div>

          <section className="grid grid-cols-12 gap-5">{children}</section>
        </div>
      </main>
    </div>
  );
}
