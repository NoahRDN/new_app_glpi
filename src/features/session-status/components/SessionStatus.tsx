import { currentUserMock } from "../../../entities/user/model/user.mock";
import { getAccessToken } from "../../../shared/auth/tokenStorage";
import { Badge } from "../../../shared/ui/Badge";

export function SessionStatus() {
  const isConnected = Boolean(getAccessToken());

  return (
    <section className="rounded-xl border border-white/12 bg-[#3b5182] p-4">
      <div>
        <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-white/55">
          Session
        </p>
        <strong className="text-sm text-white">{currentUserMock.fullName}</strong>
      </div>
      <Badge tone={isConnected ? "success" : "warning"}>
        {isConnected ? currentUserMock.role : "oauth pending"}
      </Badge>
      <p className="mt-3 text-xs text-white/70">
        {isConnected ? currentUserMock.email : "Aucun access token detecte"}
      </p>
    </section>
  );
}
