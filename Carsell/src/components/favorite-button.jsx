"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  vehicle,
  initialIsFavorited,
  onToggleFavorited,
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);
  const [currentToastId, setCurrentToastId] = useState(null);
  const router = useRouter();

  const handleFavorite = async (event) => {
    event.preventDefault();

    // Duración mínima en milisegundos para el loading
    const MIN_LOADING_TIME = 200;

    setLoading(true); // Activa la animación de carga
    const start = Date.now(); // Marca el inicio de la acción de carga

    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId: vehicle.id }),
      });

      const data = await res.json(); // Extraer los datos de la respuesta obtenida

      if (currentToastId) {
        toast.dismiss(currentToastId); // Si ya existe un toast, lo cierra para que no se muestren muchos toast cada vez que se pulsa el boton de favoritos de ese vehiculo
      }

      // Si la respuesta no es OK, muestra un toast de error
      if (!res.ok) {
        const newToastId = toast.error(data.error || "Error desconocido");
        setCurrentToastId(newToastId);
        return;
      }

      // Actualiza el estado en VehicleCard
      setIsFavorited(data.isFavorited);
      onToggleFavorited(data.isFavorited);

      // Aquí calculamos el tiempo restante para cumplir con la duración mínima (200ms)
      const elapsed = Date.now() - start;
      const remainingTime = Math.max(MIN_LOADING_TIME - elapsed, 0); // Calcula el tiempo restante para completarse

      // Esperamos al menos el tiempo mínimo para mostrar el toast (200ms)
      setTimeout(() => {
        const newToastId = toast.success(data.message);
        setCurrentToastId(newToastId); // Muestra el toast solo después del tiempo mínimo
        router.refresh(); // Refresca la página después de la actualización del estado favorito
      }, remainingTime);
    } catch (err) {
      console.error("Error:", err);

      if (currentToastId) {
        toast.dismiss(currentToastId);
      }

      // Muestra el toast de error después de la duración mínima
      const newToastId = toast.error("Error al procesar la solicitud");
      setCurrentToastId(newToastId);

      setTimeout(() => {
        setLoading(false);
      }, MIN_LOADING_TIME);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, MIN_LOADING_TIME);
    }
  };

  return (
    <button onClick={handleFavorite} disabled={loading} variant="outline">
      {loading ? (
        <Loader2 className="animate-spin text-red-600" />
      ) : isFavorited ? (
        <Heart className="text-red-600 fill-current" />
      ) : (
        <Heart className="text-red-600" />
      )}
    </button>
  );
}
