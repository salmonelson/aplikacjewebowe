import { Link } from "react-router";

export default function HomePage() {
  return (
    <section>
      <h1>Cars Application</h1>
      <p>Aplikacja do zarządzania samochodami.</p>
      <Link to="/cars">Przejdź do listy samochodów</Link>
    </section>
  );
}
