import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setUser(await login({ email, password }));
      navigate("/cars");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Logowanie nie powiodło się.");
    }
  }

  return (
    <section>
      <h1>Logowanie</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Hasło<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button type="submit">Zaloguj</button>
      </form>
      <p>Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
      <Link to="/forgot-password">Nie pamiętasz hasła?</Link>
    </section>
  );
}
