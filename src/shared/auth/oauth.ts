import { env } from "../config/env";

function buildScope() {
  return env.glpiOAuthScope
    .split(" ")
    .map((scope: string) => scope.trim())
    .filter(Boolean)
    .join(" ");
}

export function buildGlpiAuthorizationUrl() {
  if (!env.glpiClientId || !env.glpiRedirectUri) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: env.glpiClientId,
    redirect_uri: env.glpiRedirectUri,
    response_type: "code",
    scope: buildScope(),
  });

  return `${env.glpiAuthorizeUrl}?${params.toString()}`;
}
