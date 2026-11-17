import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Car } from "../models/Car";
import { getCarById } from "../services/carService";

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Brak identyfikatora samochodu.");
      return;
    }

    const controller = new AbortController();
    getCarById(id, controller.signal)
      .then(setCar)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Nie udało się pobrać samochodu.",
          );
        }
      });

    return () => controller.abort();
  }, [id]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!car) {
    return <p>Ładowanie samochodu...</p>;
  }

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
      <Link to="/cars">Wróć do listy</Link>
    </section>
  );
}