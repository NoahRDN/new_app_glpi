import { currentUserMock } from "../../../entities/user/model/user.mock";
import { getAccessToken } from "../../../shared/auth/tokenStorage";
import { Badge } from "../../../shared/ui/Badge";

export function SessionStatus() {
  const isConnected = Boolean(getAccessToken());

  return (
    <section
      className="rounded-[26px] border p-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--sidebar-soft)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      <div>
        <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--sidebar-text-muted)]">
          Session
        </p>
        <strong className="text-sm text-[var(--sidebar-text)]">{currentUserMock.fullName}</strong>
      </div>
      <Badge tone={isConnected ? "success" : "warning"}>
        {isConnected ? currentUserMock.role : "oauth pending"}
      </Badge>
      <p className="mt-3 text-xs text-[var(--sidebar-text-muted)]">
        {isConnected ? currentUserMock.email : "Aucun access token detecte"}
      </p>
    </section>
  );
}
