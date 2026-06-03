import { buildGlpiAuthorizationUrl } from "../../../shared/auth/oauth";
import { env } from "../../../shared/config/env";
import { Badge } from "../../../shared/ui/Badge";
import { Card } from "../../../shared/ui/Card";

export function OAuthSetupCard() {
  const authorizationUrl = buildGlpiAuthorizationUrl();

  return (
    <Card
      className="xl:col-span-12"
      title="Client OAuth"
      description="Presentation claire de la configuration a reproduire dans GLPI pour ton application."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">Nom</span>
            <input
              readOnly
              value="NewApp Local"
              className="h-12 rounded-2xl border px-4 text-sm"
              style={{
                backgroundColor: "var(--panel-soft)",
                borderColor: "var(--panel-border)",
                color: "var(--text-primary)",
              }}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">Client ID</span>
            <input
              readOnly
              value={env.glpiClientId || "Renseigne VITE_GLPI_OAUTH_CLIENT_ID"}
              className="h-12 rounded-2xl border px-4 text-sm text-[var(--text-primary)]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent-orange) 10%, var(--panel-bg))",
                borderColor: "color-mix(in srgb, var(--accent-orange) 20%, var(--panel-border))",
              }}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">
              URI de redirection autorisee
            </span>
            <input
              readOnly
              value={env.glpiRedirectUri || "http://localhost:5173/auth/callback"}
              className="h-12 rounded-2xl border px-4 text-sm"
              style={{
                backgroundColor: "var(--panel-soft)",
                borderColor: "var(--panel-border)",
                color: "var(--text-primary)",
              }}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">Endpoint token</span>
            <input
              readOnly
              value={env.glpiTokenUrl}
              className="h-12 rounded-2xl border px-4 text-sm"
              style={{
                backgroundColor: "var(--panel-soft)",
                borderColor: "var(--panel-border)",
                color: "var(--text-primary)",
              }}
            />
          </label>
        </div>

        <div className="grid gap-4">
          <div
            className="rounded-[24px] border p-4"
            style={{
              backgroundColor: "var(--panel-soft)",
              borderColor: "var(--panel-border)",
            }}
          >
            <p className="mb-3 text-sm font-medium text-[var(--text-primary)]">Scopes</p>
            <div className="flex flex-wrap gap-2">
              {["email", "user", "api", "inventory", "status"].map((scope) => (
                <Badge key={scope}>{scope}</Badge>
              ))}
            </div>
          </div>
          <div
            className="rounded-[24px] border p-4"
            style={{
              backgroundColor: "var(--panel-soft)",
              borderColor: "var(--panel-border)",
            }}
          >
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Le `client secret` ne doit pas etre embarque dans un frontend Vite.
              Utilise idealement un backend ou BFF pour echanger le `code` contre un
              `access_token`.
            </p>
          </div>
          {authorizationUrl ? (
            <a
              className="inline-flex w-fit items-center rounded-2xl px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm"
              style={{ backgroundColor: "var(--accent-blue)" }}
              href={authorizationUrl}
            >
              Lancer l'autorisation GLPI
            </a>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              Renseigne `VITE_GLPI_OAUTH_CLIENT_ID` et `VITE_GLPI_OAUTH_REDIRECT_URI`
              dans le `.env` pour activer le lien d'autorisation.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
