import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Error } from "../../../shared/ui/Error";
import { Input } from "../../../shared/ui/Input";
import { Label } from "../../../shared/ui/Label";
import { signInFrontoffice } from "../lib/frontofficeAuth";

export function FrontofficeLoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("front");
  const [password, setPassword] = useState("front123");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Username et mot de passe sont requis.");
      return;
    }

    signInFrontoffice();
    navigate("/", { replace: true });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error !== "" ? <Error>{error}</Error> : null}

      <div className="space-y-2">
        <Label htmlFor="frontoffice-username">Username</Label>
        <Input
          id="frontoffice-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frontoffice-password">Mot de passe</Label>
        <Input
          id="frontoffice-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button otherClassName="w-full justify-center" type="submit">
        Se connecter au frontoffice
      </Button>
    </form>
  );
}
