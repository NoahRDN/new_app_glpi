import { env } from "../../../shared/config/env";
import { AppError } from "../../../shared/errors/AppError";

export type OAuthTokenPayload = {
  clientId?: string;
  clientSecret?: string;
  grantType?: string;
  password?: string;
  scope?: string;
  username?: string;
};

export type OAuthTokenResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

export async function createOAuthToken(
  payload: OAuthTokenPayload = {},
): Promise<OAuthTokenResponse> {
  const body = new URLSearchParams({
    grant_type: payload.grantType ?? "password",
    client_id: payload.clientId ?? env.glpiOAuthClientId,
    client_secret: payload.clientSecret ?? env.glpiOAuthClientSecret,
    username: payload.username ?? env.glpiOAuthUsername,
    password: payload.password ?? env.glpiOAuthPassword,
    scope: payload.scope ?? env.glpiOAuthScope,
  });

  let response: Response;

  try {
    response = await fetch(env.glpiOAuthTokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  } catch {
    throw new AppError({
      message: "Network error while creating GLPI OAuth token",
      userMessage: "Impossible de contacter le serveur GLPI.",
      code: "NETWORK_ERROR",
    });
  }

  if (!response.ok) {
    const details = await response.text();

    throw new AppError({
      message: `GLPI OAuth token failed: ${response.status} ${response.statusText}`,
      userMessage: "Impossible de récupérer un token OAuth GLPI.",
      code: "OAUTH_ERROR",
      status: response.status,
      details,
    });
  }

  return response.json() as Promise<OAuthTokenResponse>;
}
