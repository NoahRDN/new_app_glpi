import { ArrowRight, Database, LifeBuoy, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

const frontOfficeHighlights = [
  {
    description: "Expose un portail clair pour les demandes et le suivi utilisateur.",
    icon: LifeBuoy,
    title: "Support centralisé",
  },
  {
    description: "Sépare l’espace public du pilotage GLPI administratif.",
    icon: ShieldCheck,
    title: "Frontoffice / Backoffice",
  },
  {
    description: "Prépare les imports CSV et les réinitialisations de données par domaines.",
    icon: Database,
    title: "Data operations",
  },
];

export function HomePage() {
  return (
    <section className="col-span-12 grid gap-6 rounded-[32px] border bg-(--panel-bg) p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_0.8fr]" style={{ borderColor: "var(--panel-border)" }}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">GLPI Frontoffice</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-(--text-primary) lg:text-6xl">
            Un portail public distinct du backoffice, avec la même logique de séparation que Prestashop.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-(--text-secondary)">
            Les utilisateurs voient un espace d’accueil, d’orientation et d’accès. Les opérations d’administration, d’import et de reset restent dans le backoffice GLPI.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 rounded-full bg-(--accent-blue) px-6 py-4 text-sm font-semibold text-white"
            >
              Ouvrir le portail
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-(--panel-soft) px-6 py-4 text-sm font-semibold text-(--text-primary)"
            >
              Aller au backoffice
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[28px] bg-(--panel-soft) p-5">
          {frontOfficeHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-[24px] bg-(--panel-bg) p-5 shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-(--panel-soft) text-(--accent-blue)">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-semibold text-(--text-primary)">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-(--text-secondary)">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
  );
}
