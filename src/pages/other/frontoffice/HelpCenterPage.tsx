const knowledgeSections = [
  {
    items: ["Procédure de connexion", "Réinitialisation de mot de passe", "Première prise en main"],
    title: "Guides d’accès",
  },
  {
    items: ["Déclarer un ticket", "Suivre le traitement", "Comprendre les priorités"],
    title: "Assistance",
  },
  {
    items: ["Consulter les équipements", "Vérifier un poste", "Comprendre les attributions"],
    title: "Parc et matériels",
  },
];

export function HelpCenterPage() {
  return (
    <>
      <section className="col-span-12 rounded-[32px] border bg-(--panel-bg) p-8 shadow-[var(--shadow-soft)]" style={{ borderColor: "var(--panel-border)" }}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">Aide</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-(--text-primary)">Centre de connaissances frontoffice</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-(--text-secondary)">
          Le principe est le même que dans Prestashop: le frontoffice expose un espace lisible pour l’utilisateur final, tandis que le backoffice concentre les opérations métier et les configurations.
        </p>
      </section>

      <section className="col-span-12 grid gap-6 lg:grid-cols-3">
        {knowledgeSections.map((section) => (
          <article
            key={section.title}
            className="rounded-[28px] border bg-(--panel-bg) p-6 shadow-[var(--shadow-soft)]"
            style={{ borderColor: "var(--panel-border)" }}
          >
            <h2 className="text-xl font-semibold text-(--text-primary)">{section.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-(--text-secondary)">
              {section.items.map((item) => (
                <li key={item} className="rounded-2xl bg-(--panel-soft) px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}
