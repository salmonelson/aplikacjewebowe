import { Link } from "react-router";
import type { Car } from "../models/Car";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

const EMPTY_FAVORITES: string[] = [];

export default function CarCard({ car, onDelete }: CarCardProps) {
  const user = useAuthStore((state) => state.user);
  const isFavorite = useCarUiStore((state) =>
    user
      ? (state.favoriteCarIdsByUser[user.id] ?? EMPTY_FAVORITES).includes(
          car.id,
        )
      : false,
  );
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const isAdmin = user?.roles.includes("Admin") ?? false;

  return (
    <li className="car-card">
      <span className="car-card__name">
        {car.brand} {car.model}
      </span>
      <span className="car-card__actions">
        <Link to={`/cars/${car.id}`}>Szczegóły</Link>
        <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
        <button
          type="button"
          onClick={() => user && toggleFavorite(user.id, car.id)}
        >
          {isFavorite ? "Usuń z ulubionych" : "Ulubione"}
        </button>
        {isAdmin && (
          <button type="button" onClick={() => onDelete(car.id)}>
            Usuń
          </button>
        )}
      </span>
    </li>
  );
}
