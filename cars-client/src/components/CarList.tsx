import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "../models/Car";
import { deleteCar, getCars } from "../services/carService";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";
import CarCard from "./CarCard";

const EMPTY_FAVORITES: string[] = [];

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore(
    (state) => state.setShowFavoritesOnly,
  );
  const user = useAuthStore((state) => state.user);
  const favoriteCarIds = useCarUiStore((state) =>
    user
      ? state.favoriteCarIdsByUser[user.id] ?? EMPTY_FAVORITES
      : EMPTY_FAVORITES,
  );
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();

    getCars(controller.signal)
      .then(setCars)
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError)) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Nie udało się pobrać samochodów.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const visibleCars = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesSearch =
        query.length === 0 ||
        `${car.brand} ${car.model}`.toLowerCase().includes(query);
      const matchesFavorites =
        !showFavoritesOnly || favoriteCarIds.includes(car.id);

      return matchesSearch && matchesFavorites;
    });
  }, [cars, favoriteCarIds, searchTerm, showFavoritesOnly]);

  async function handleDelete(id: string) {
    if (!window.confirm("Czy na pewno usunąć ten samochód?")) {
      return;
    }

    try {
      await deleteCar(id);
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
      if (user) removeFavorite(user.id, id);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się usunąć samochodu.",
      );
    }
  }

  if (loading) {
    return <p>Ładowanie samochodów...</p>;
  }

  return (
    <>
      <div className="car-list__filters">
        <label>
          Szukaj
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Marka lub model"
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Tylko ulubione
        </label>
      </div>

      {error && <p role="alert">{error}</p>}
      {visibleCars.length === 0 ? (
        <p>Brak samochodów spełniających kryteria.</p>
      ) : (
        <ul className="car-list">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </>
  );
}
