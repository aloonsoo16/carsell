import React from "react";
import NewVehicle from "@/components/new-vehicle";

export default async function NewPage() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col lg:flex-row h-full px-6 md:py-6 lg:py-16">
      <div className="w-full lg:w-2/4 flex flex-col pb-2 md:p-0 lg:px-8 justify-between order-1 lg:order-2 mb-4 md:mb-0">
        <div className="w-full p-2 md:p-4 gap-x-2 flex items-center justify-start  lg:justify-end">
          <span className="font-semibold text-lg md:text-2xl">Publica un anuncio</span>
        </div>
        <div className="w-full p-2 gap-2 justify-center md:p-4 md:gap-y-2 flex flex-col  lg:items-end ">
          <span className="font-semibold text-sm md:text-base">
            Quieres poner a la venta un vehículo? Puedes hacerlo desde esta
            sección
          </span>
          <span className="font-semibold mt-1 text-sm">
            * La finalidad no es poner a la venta vehículos reales, sino
            interactuar con la aplicación
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-2/4 order-2 lg:order-1">
        <NewVehicle />
      </div>
    </div>
  );
}
