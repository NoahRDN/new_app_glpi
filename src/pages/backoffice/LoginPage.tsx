import { Link } from "react-router";
import { BackofficeLoginForm } from "../../features/backoffice-auth/components/BackofficeLoginForm";

export function LoginPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-[32px] border bg-(--panel-bg) p-8 shadow-[var(--shadow-soft)]" style={{ borderColor: "var(--panel-border)" }}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">Connexion admin</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-(--text-primary)">Backoffice GLPI</h1>
      <p className="mt-4 text-base leading-8 text-(--text-secondary)">
        Connexion distincte pour l’administration, les imports CSV et la réinitialisation des données.
      </p>

      <div className="mt-8 grid gap-6 rounded-[28px] bg-(--panel-soft) p-5 ">
        <div className="rounded-[24px] bg-(--panel-bg) p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-4 rounded-[18px] bg-(--panel-soft) px-4 py-3 text-sm text-(--text-secondary)">
            Identifiants de test préremplis : <span className="font-semibold text-(--text-primary)">admin</span> / <span className="font-semibold text-(--text-primary)">admin123</span>.
          </div>
          <BackofficeLoginForm />
        </div>

        {/* <div className="rounded-[24px] bg-(--panel-bg) p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold text-(--text-primary)">Frontoffice</h2>
          <p className="mt-2 text-sm leading-7 text-(--text-secondary)">
            Les utilisateurs disposent maintenant d’une session séparée et d’un shell visuel proche du backoffice.
          </p>
          <Link
            to="/connexion"
            className="mt-5 inline-flex rounded-full bg-(--accent-blue) px-5 py-3 text-sm font-semibold text-white"
          >
            Aller au login frontoffice
          </Link>
        </div> */}
      </div>
    </section>
  );
}
