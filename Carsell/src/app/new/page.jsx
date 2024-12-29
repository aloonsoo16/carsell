import React from "react";
import NewVehicle from "@/components/new-vehicle";

export default async function NewPage() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen md:min-h-0 gap-6 px-4 md:px-6 py-4 lg:py-16">
      {/* Columna izquierda: Formulario */}
      <div className="flex flex-col justify-center items-center lg:items-start order-2 lg:order-1">
        <NewVehicle />
      </div>

      {/* Columna derecha: Textos indicativos */}
      <div className="flex flex-col justify-between order-1 lg:order-2 pt-4 pb-4 lg:pb-0">
        <div className="flex justify-start lg:justify-end">
          <span className="font-semibold text-lg md:text-2xl">
            Publica un anuncio
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-4 items-start lg:items-end">
          <span className="font-semibold text-sm md:text-base">
            ¿Quieres poner a la venta un vehículo? Puedes hacerlo desde esta
            sección.
          </span>
          <span className="font-semibold mt-1 text-sm">
            * La finalidad no es poner a la venta vehículos reales, sino
            interactuar con la aplicación.
          </span>
        </div>
      </div>
    </div>
  );
}
