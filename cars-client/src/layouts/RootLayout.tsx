import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Główne menu">
          <NavLink to="/">Strona główna</NavLink>
          <NavLink to="/cars">Samochody</NavLink>
          <NavLink to="/cars/new">Dodaj samochód</NavLink>
        </nav>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}