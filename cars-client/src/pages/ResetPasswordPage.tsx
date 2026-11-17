import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email || !token) return;
    try {
      setMessage(await resetPassword(email, token, password));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nie udało się zmienić hasła.");
    }
  }

  if (!email || !token) {
    return <section><h1>Nieprawidłowy link</h1><Link to="/login">Wróć do logowania</Link></section>;
  }

  return (
    <section>
      <h1>Ustaw nowe hasło</h1>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>Nowe hasło<input type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button type="submit">Zmień hasło</button>
      </form>
    </section>
  );
}
