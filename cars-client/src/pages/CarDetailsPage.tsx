import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

const EMPTY_FAVORITES: string[] = [];

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const favoriteCarIds = useCarUiStore((state) =>
    user
      ? state.favoriteCarIdsByUser[user.id] ?? EMPTY_FAVORITES
      : EMPTY_FAVORITES,
  );
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (!id) {
      setError("Brak identyfikatora samochodu.");
      return;
    }

    const controller = new AbortController();
    getCarById(id, controller.signal)
      .then(setCar)
      .catch((requestError: unknown) => {
        if (axios.isCancel(requestError)) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Nie udało się pobrać samochodu.",
        );
      });

    return () => controller.abort();
  }, [id]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!car) {
    return <p>Ładowanie samochodu...</p>;
  }

  const isFavorite = favoriteCarIds.includes(car.id);

  return (
    <section>
      <h1>
        {car.brand} {car.model}
      </h1>
      <dl>
        <dt>Liczba drzwi</dt>
        <dd>{car.doorsNumber}</dd>
        <dt>Pojemność bagażnika</dt>
        <dd>{car.luggageCapacity}</dd>
        <dt>Pojemność silnika</dt>
        <dd>{car.engineCapacity}</dd>
        <dt>Paliwo</dt>
        <dd>{car.fuelType}</dd>
        <dt>Data produkcji</dt>
        <dd>{new Date(car.productionDate).toLocaleDateString()}</dd>
        <dt>Średnie spalanie</dt>
        <dd>{car.averageFuelConsumption}</dd>
        <dt>Typ nadwozia</dt>
        <dd>{car.bodyType}</dd>
      </dl>
      <button
        type="button"
        onClick={() => user && toggleFavorite(user.id, car.id)}
      >
        {isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      </button>
      {" "}
      <Link to="/cars">Wróć do listy</Link>
    </section>
  );
}