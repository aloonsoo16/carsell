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

  const vehicle = await db.vehicle.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (!vehicle || vehicle.userId !== currentUserId) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="text-sm font-semibold">
            Acceso denegado: No tienes permiso para editar este vehículo
          </h2>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen md:min-h-0 gap-6 px-4 md:px-6 py-4 lg:py-16">
      {/* Columna izquierda: Formulario */}
      <div className="flex flex-col justify-center items-center lg:items-start order-2 lg:order-1">
        <NewVehicle vehicle={vehicle} />
      </div>

      {/* Columna derecha: Detalles y EditCard */}
      <div className="flex flex-col justify-between order-1 lg:order-2 ">
        <div className="flex flex-col gap-4">
          <div className="flex justify-start lg:justify-end">
            <span className="font-semibold text-lg md:text-2xl">
              Editar {vehicle.brand} {vehicle.model} {vehicle.version}
            </span>
          </div>
          <div className="flex flex-col gap-2 items start lg:items-end justify-center mt-0 lg:mt-12">
            <span className="font-semibold text-sm md:text-base">
              Edita los campos que consideres necesarios desde esta sección
            </span>
            <span className="font-semibold mt-1 text-sm">
              * La finalidad no es poner a la venta vehículos reales, sino
              interactuar con la aplicación
            </span>
          </div>
        </div>

        <div className="mt-8">
          <EditCard
            vehicle={vehicle}
            isDraft={vehicle.isDraft}
            currentUserId={currentUserId}
            showDate={true}
          />
        </div>
      </div>
    </div>
  );
}
