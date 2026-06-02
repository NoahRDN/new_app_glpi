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
            <span className="text-sm font-medium text-slate-700">Nom</span>
            <input
              readOnly
              value="NewApp Local"
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Client ID</span>
            <input
              readOnly
              value={env.glpiClientId || "Renseigne VITE_GLPI_OAUTH_CLIENT_ID"}
              className="h-11 rounded-md border border-amber-200 bg-amber-50 px-3 text-sm text-slate-700"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">
              URI de redirection autorisee
            </span>
            <input
              readOnly
              value={env.glpiRedirectUri || "http://localhost:5173/auth/callback"}
              className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Endpoint token</span>
            <input
              readOnly
              value={env.glpiTokenUrl}
              className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
            />
          </label>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-medium text-slate-700">Scopes</p>
            <div className="flex flex-wrap gap-2">
              {["email", "user", "api", "inventory", "status"].map((scope) => (
                <Badge key={scope}>{scope}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              Le `client secret` ne doit pas etre embarque dans un frontend Vite.
              Utilise idealement un backend ou BFF pour echanger le `code` contre un
              `access_token`.
            </p>
          </div>
          {authorizationUrl ? (
            <a
              className="inline-flex w-fit items-center rounded-md bg-[#f7bf56] px-4 py-2 text-sm font-semibold text-slate-800 no-underline shadow-sm"
              href={authorizationUrl}
            >
              Lancer l'autorisation GLPI
            </a>
          ) : (
            <p className="text-sm text-slate-500">
              Renseigne `VITE_GLPI_OAUTH_CLIENT_ID` et `VITE_GLPI_OAUTH_REDIRECT_URI`
              dans le `.env` pour activer le lien d'autorisation.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
