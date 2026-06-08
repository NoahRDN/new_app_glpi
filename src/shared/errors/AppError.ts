import { env } from "../config/env";

// src/shared/errors/AppError.ts
export type AppErrorCode =
  | "NETWORK_ERROR"
  | "OAUTH_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "GLPI_API_ERROR";

export class AppError extends Error {
  public readonly userMessage: string;
  public readonly status?: number;
  public readonly code: AppErrorCode;
  public readonly details?: string;

  constructor(params: {
    message: string;
    userMessage: string;
    code: AppErrorCode;
    status?: number;
    details?: string;
  }) {
    super(params.message);
    this.name = "AppError";
    this.userMessage = params.userMessage;
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }
}

export function getUserErrorMessage(
  error: unknown,
  fallbackMessage = "Une erreur inattendue est survenue.",
  debug: boolean = env.modeDebug
): string {
  if (debug) {
    console.error("Détail Erreur: ", error)
  }

  if (error instanceof AppError) {
    return error.userMessage;
  }

  return fallbackMessage;
}