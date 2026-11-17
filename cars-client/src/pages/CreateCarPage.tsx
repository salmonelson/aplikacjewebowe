import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import type { NewCar } from "../models/Car";
import { createCar } from "../services/carService";

const initialCar: NewCar = {
  brand: "",
  model: "",
  doorsNumber: 5,
  luggageCapacity: 0,
  engineCapacity: 0,
  fuelType: "",
  productionDate: "",
  averageFuelConsumption: 0,
  bodyType: "",
};

export default function CreateCarPage() {
  const navigate = useNavigate();
  const [car, setCar] = useState<NewCar>(initialCar);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(
    field: keyof NewCar,
    value: string,
  ) {
    setCar((currentCar) => ({
      ...currentCar,
      [field]:
        field === "doorsNumber" ||
        field === "luggageCapacity" ||
        field === "engineCapacity" ||
        field === "averageFuelConsumption"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const createdCar = await createCar(car);
      navigate(`/cars/${createdCar.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nie udało się utworzyć samochodu.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1>Dodaj samochód</h1>
      {error && <p role="alert">{error}</p>}
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
        <button type="submit" disabled={saving}>{saving ? "Zapisywanie..." : "Zapisz"}</button>
      </form>
    </section>
  );
}