import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result = await forgotPassword(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nie udało się rozpocząć resetowania.");
    }
  }

  return (
    <section>
      <h1>Odzyskiwanie hasła</h1>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <button type="submit">Wyślij instrukcję</button>
      </form>
      <Link to="/login">Wróć do logowania</Link>
    </section>
  );
}
