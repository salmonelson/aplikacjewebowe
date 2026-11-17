import { NavLink } from "react-router";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

export default function Navigation() {
  const user = useAuthStore((state) => state.user);
  const favoriteCount = useCarUiStore((state) =>
    user ? (state.favoriteCarIdsByUser[user.id] ?? []).length : 0,
  );
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="site-nav" aria-label="Główne menu">
      <NavLink to="/">Strona główna</NavLink>
      {user && (
        <>
          <NavLink to="/cars" end>Samochody</NavLink>
          <NavLink to="/cars/new">Dodaj samochód</NavLink>
          <span aria-label={`${favoriteCount} ulubionych samochodów`}>
            Ulubione: {favoriteCount}
          </span>
        </>
      )}
      {user ? (
        <button type="button" onClick={logout}>Wyloguj ({user.userName})</button>
      ) : (
        <>
          <Link to="/login">Logowanie</Link>
          <Link to="/register">Rejestracja</Link>
        </>
      )}
    </nav>
  );
}
