import { Link } from "react-router";
import { FrontofficeLoginForm } from "../../../features/frontoffice-auth/components/FrontofficeLoginForm";

export function LoginPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border bg-(--panel-bg) p-8 shadow-[var(--shadow-soft)]" style={{ borderColor: "var(--panel-border)" }}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">Connexion</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-(--text-primary)">Point d’entrée frontoffice</h1>
      <p className="mt-4 text-base leading-8 text-(--text-secondary)">
        Cette page marque la séparation applicative. Le frontoffice porte les flux publics et utilisateurs. Le backoffice reste dédié à l’administration GLPI.
      </p>

      <div className="mt-8 grid gap-4 rounded-[28px] bg-(--panel-soft) p-5 md:grid-cols-2">
        <div className="rounded-[24px] bg-(--panel-bg) p-5 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 text-lg font-semibold text-(--text-primary)">Connexion utilisateur</h2>
          <div className="mb-4 rounded-[18px] bg-(--panel-soft) px-4 py-3 text-sm text-(--text-secondary)">
            Identifiants de test préremplis : <span className="font-semibold text-(--text-primary)">front</span> / <span className="font-semibold text-(--text-primary)">front123</span>.
          </div>
          <FrontofficeLoginForm />
        </div>

        <div className="rounded-[24px] bg-(--panel-bg) p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold text-(--text-primary)">Administration</h2>
          <p className="mt-2 text-sm leading-7 text-(--text-secondary)">
            L’administration complète, l’import CSV et la réinitialisation sont maintenant regroupés sous `/admin`.
          </p>
          <Link
            to="/admin/connexion"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--accent-blue) px-5 py-3 text-sm font-semibold text-white"
          >
            Ouvrir le backoffice
          </Link>
        </div>
      </div>
    </section>
  );
}
