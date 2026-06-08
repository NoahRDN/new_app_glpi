import { CircleHelp, ClipboardList, MonitorSmartphone, Users } from "lucide-react";

const portalCards = [
  {
    description: "Déclarer un incident, une panne ou une demande de support.",
    icon: CircleHelp,
    title: "Support utilisateur",
  },
  {
    description: "Consulter ses demandes en cours et leur progression.",
    icon: ClipboardList,
    title: "Suivi des tickets",
  },
  {
    description: "Parcourir le parc visible et les équipements attribués.",
    icon: MonitorSmartphone,
    title: "Parc visible",
  },
  {
    description: "Accéder aux espaces liés aux profils et groupes d’utilisateurs.",
    icon: Users,
    title: "Accès et profils",
  },
];

export function PortalPage() {
  return (
    <>
      <section className="col-span-12 rounded-[32px] border bg-(--panel-bg) p-8 shadow-[var(--shadow-soft)]" style={{ borderColor: "var(--panel-border)" }}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">Portail de services</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-(--text-primary)">Frontoffice utilisateur GLPI</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-(--text-secondary)">
          Cette couche est pensée pour le self-service, l’orientation et l’accès contrôlé. Le backoffice conserve la configuration, les imports et les opérations sensibles.
        </p>
      </section>

      <section className="col-span-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {portalCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-[28px] border bg-(--panel-bg) p-6 shadow-[var(--shadow-soft)]"
              style={{ borderColor: "var(--panel-border)" }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--panel-soft) text-(--accent-blue)">
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-semibold text-(--text-primary)">{card.title}</h2>
              <p className="mt-2 text-sm leading-7 text-(--text-secondary)">{card.description}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}
