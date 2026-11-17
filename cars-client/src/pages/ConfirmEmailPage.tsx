import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { confirmEmail } from "../services/authService";

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const token = params.get("token");
  const [message, setMessage] = useState("Potwierdzanie konta...");

  useEffect(() => {
    if (!userId || !token) return;
    confirmEmail(userId, token)
      .then(setMessage)
      .catch(() => setMessage("Nie udało się potwierdzić konta."));
  }, [userId, token]);

  return (
    <section>
      <h1>Potwierdzenie konta</h1>
      <p>{userId && token ? message : "Nieprawidłowy link."}</p>
      <Link to="/login">Przejdź do logowania</Link>
    </section>
  );
}
