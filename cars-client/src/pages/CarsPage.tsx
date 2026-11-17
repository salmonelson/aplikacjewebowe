import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Car } from "../models/Car";
import { deleteCar, getCars } from "../services/carService";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getCars(controller.signal)
      .then(setCars)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
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

  async function handleDelete(id: string) {
    if (!window.confirm("Czy na pewno usunąć ten samochód?")) {
      return;
    }

    try {
      await deleteCar(id);
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
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
    <section>
      <h1>Samochody</h1>
      {error && <p role="alert">{error}</p>}
      {cars.length === 0 ? (
        <p>Brak samochodów.</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              <span>
                {car.brand} {car.model}
              </span>{" "}
              <Link to={`/cars/${car.id}`}>Szczegóły</Link>{" "}
              <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>{" "}
              <button type="button" onClick={() => handleDelete(car.id)}>
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}