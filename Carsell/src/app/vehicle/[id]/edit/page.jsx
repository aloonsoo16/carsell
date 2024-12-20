import React from "react";
import NewVehicle from "@/components/new-vehicle";
import db from "@/libs/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditCard from "@/components/edit-card";
import { Separator } from "@/components/ui/separator";

export default async function VehicleEdit({ params }) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  console.log("Editar vehiculo ID:", id); // Verificar que el ID se obtiene correctamente

  const vehicle = await db.vehicle.findFirst({
    where: {
      id: parseInt(id), // Usar el ID convertido a número entero para la consulta
    },
  });

  console.log("Datos del vehiculo:", vehicle);

  // Verifica si el vehículo existe y si el usuario es el propietario, sino, muestra mensaje de error indicándolo
  if (!vehicle || vehicle.userId !== currentUserId) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="text-sm font-semibold">
            Acceso denegado: No tienes permiso para editar este vehiculo
          </h2>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full px-6 md:py-6 lg:py-16 gap-y-6">
      <div className="w-full lg:w-2/4 flex flex-col lg:px-8 justify-between order-1 lg:order-2">
        <div className="w-full p-2 md:p-4 gap-x-2 flex items-center justify-start  lg:justify-end ">
          <span className="font-semibold text-lg md:text-2xl">
            Editar {vehicle.brand} {vehicle.model} {vehicle.version}
          </span>
        </div>
        <div className="w-full p-2 gap-2 justify-center md:p-4 md:gap-y-2 flex flex-col  lg:items-end ">
          <span className="font-semibold text-sm md:text-base">
            Edita los campos que consideres necesarios desde esta sección
          </span>
          <span className="font-semibold mt-1 text-sm">
            * La finalidad no es poner a la venta vehículos reales, sino
            interactuar con la aplicación
          </span>
        </div>

        <div className="mt-4 md:mt-8 mb-8 md:mb-0">
          <EditCard
            vehicle={vehicle}
            isDraft={vehicle.isDraft}
            currentUserId={currentUserId}
            showDate={true}
          />
        </div>
        <Separator className="w-full md:hidden" />
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-2/4 order-1 lg:order-1 ">
        <NewVehicle vehicle={vehicle} />
      </div>
    </div>
  );
}
