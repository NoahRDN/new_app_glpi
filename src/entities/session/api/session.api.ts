import { glpiGet } from "../../../shared/api/glpiClient";

export type SessionInfo = {
  [key: string]: unknown;
};

export async function getSession(): Promise<SessionInfo> {
  return glpiGet<SessionInfo>("/session");
}
