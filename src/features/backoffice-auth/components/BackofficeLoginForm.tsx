import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { MyError } from "../../../shared/ui/MyError";
import { Input } from "../../../shared/ui/Input";
import { Label } from "../../../shared/ui/Label";
import { signInBackoffice } from "../lib/backofficeAuth";

export function BackofficeLoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Username et mot de passe sont requis.");
      return;
    }

    signInBackoffice();
    navigate("/admin", { replace: true });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error !== "" ? <MyError>{error}</MyError> : null}

      <div className="space-y-2">
        <Label htmlFor="backoffice-username">Username admin</Label>
        <Input
          id="backoffice-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backoffice-password">Mot de passe admin</Label>
        <Input
          id="backoffice-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button otherClassName="w-full justify-center" type="submit">
        Se connecter au backoffice
      </Button>
    </form>
  );
}
