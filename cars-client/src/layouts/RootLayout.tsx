import { Outlet } from "react-router";
import Navigation from "../components/Navigation";

export default function RootLayout() {
  return (
    <>
      <header className="site-header">
        <Navigation />
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}