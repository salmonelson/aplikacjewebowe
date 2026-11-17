import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { NewCar } from "../models/Car";
import { getCarById, updateCar } from "../services/carService";

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<NewCar | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    getCarById(id, controller.signal)
      .then((existingCar) => {
        const { id: ignoredId, ...carData } = existingCar;
        void ignoredId;
        setCar(carData);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "Nie udało się pobrać samochodu.");
        }
      });
    return () => controller.abort();
  }, [id]);

  function updateField(field: keyof NewCar, value: string) {
    setCar((currentCar) =>
      currentCar
        ? {
            ...currentCar,
            [field]:
              field === "doorsNumber" ||
              field === "luggageCapacity" ||
              field === "engineCapacity" ||
              field === "averageFuelConsumption"
                ? Number(value)
                : value,
          }
        : currentCar,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !car) return;
    setSaving(true);
    setError("");
    try {
      await updateCar(id, car);
      navigate(`/cars/${id}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nie udało się zaktualizować samochodu.");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p role="alert">{error}</p>;
  if (!car) return <p>Ładowanie samochodu...</p>;

  return (
    <section>
      <h1>Edytuj samochód</h1>
      <form onSubmit={handleSubmit}>
        <label>Marka<input value={car.brand} onChange={(event) => updateField("brand", event.target.value)} required /></label>
        <label>Model<input value={car.model} onChange={(event) => updateField("model", event.target.value)} required /></label>
        <label>Liczba drzwi<input type="number" min="2" max="5" value={car.doorsNumber || ""} onChange={(event) => updateField("doorsNumber", event.target.value)} required /></label>
        <label>Pojemność bagażnika<input type="number" min="0" value={car.luggageCapacity || ""} onChange={(event) => updateField("luggageCapacity", event.target.value)} required /></label>
        <label>Pojemność silnika<input type="number" step="0.1" min="0.1" value={car.engineCapacity || ""} onChange={(event) => updateField("engineCapacity", event.target.value)} required /></label>
        <label>Paliwo<input value={car.fuelType} onChange={(event) => updateField("fuelType", event.target.value)} required /></label>
        <label>Data produkcji<input type="date" value={car.productionDate.slice(0, 10)} onChange={(event) => updateField("productionDate", event.target.value)} required /></label>
        <label>Średnie spalanie<input type="number" step="0.1" min="0.1" value={car.averageFuelConsumption || ""} onChange={(event) => updateField("averageFuelConsumption", event.target.value)} required /></label>
        <label>Typ nadwozia<input value={car.bodyType} onChange={(event) => updateField("bodyType", event.target.value)} required /></label>
        <button type="submit" disabled={saving}>{saving ? "Zapisywanie..." : "Zapisz zmiany"}</button>
        <Link to={`/cars/${id}`}>Anuluj</Link>
      </form>
    </section>
  );
}