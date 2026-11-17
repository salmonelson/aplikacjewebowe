import type { Car, NewCar } from "../models/Car";

const carsUrl = "http://localhost:3000/cars";

async function ensureSuccess(response: Response): Promise<void> {
  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Request failed. Status: ${response.status}${details ? ` - ${details}` : ""}`,
    );
  }
}

export async function getCars(signal?: AbortSignal): Promise<Car[]> {
  const response = await fetch(carsUrl, { signal });
  await ensureSuccess(response);
  return response.json() as Promise<Car[]>;
}

export async function getCarById(
  id: string,
  signal?: AbortSignal,
): Promise<Car> {
  const response = await fetch(`${carsUrl}/${id}`, { signal });
  await ensureSuccess(response);
  return response.json() as Promise<Car>;
}

export async function createCar(
  car: NewCar,
  signal?: AbortSignal,
): Promise<Car> {
  const response = await fetch(carsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
    signal,
  });

  await ensureSuccess(response);
  return response.json() as Promise<Car>;
}

export async function updateCar(
  id: string,
  car: NewCar,
  signal?: AbortSignal,
): Promise<Car> {
  const response = await fetch(`${carsUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(car),
    signal,
  });

  await ensureSuccess(response);
  return { id, ...car };
}

export async function deleteCar(
  id: string,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${carsUrl}/${id}`, {
    method: "DELETE",
    signal,
  });
  await ensureSuccess(response);
}
