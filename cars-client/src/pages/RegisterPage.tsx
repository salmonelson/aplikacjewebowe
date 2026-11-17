import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result = await register({ userName, email, password });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Rejestracja nie powiodła się.");
    }
  }

  return (
    <section>
      <h1>Rejestracja</h1>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>
          Nazwa użytkownika
          <input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            pattern="[A-Za-z0-9]+"
            title="Nazwa użytkownika może zawierać tylko litery i cyfry."
            required
          />
        </label>
        <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>
          Hasło
          <input
            type="password"
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
            title="Hasło musi mieć co najmniej 8 znaków, małą i wielką literę oraz cyfrę."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Zarejestruj</button>
      </form>
      <p><Link to="/login" onClick={() => navigate("/login")}>Przejdź do logowania</Link></p>
    </section>
  );
}
