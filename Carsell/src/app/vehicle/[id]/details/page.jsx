import React from "react";
import db from "@/libs/db";
import VehicleDetails from "@/components/vehicle-details";
import SimpleCard from "@/components/simple-card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MoreCard from "@/components/more-card";

export default async function Details({ params }) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  console.log("Detalles del vehiculo ID:", id);

  const vehicle = await db.vehicle.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  // Si el vehículo no existe, se muestra un mensaje indicándolo
  if (!vehicle) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="font-semibold text-sm">
            El vehículo que buscas no existe
          </h2>
        </div>
      </section>
    );
  }

  const favorites = currentUserId
    ? await db.favorite.findMany({
        where: {
          userId: currentUserId,
        },
      })
    : [];

  const favoriteVehicleIds = new Set(favorites.map((f) => f.vehicleId));

  // Obtener vehículos similares solo si el vehículo existe y excluir el id del vehículo de detalles actual
  const vehiclesOfSameBrand = await db.vehicle.findMany({
    where: {
      brand: vehicle.brand,
      id: { not: vehicle.id },
    },
    take: 5, // Solo se muetsran 5 resultados
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 px-4 pt-4 xl:px-10">
      <div className="flex flex-col w-full xl:w-3/4 gap-y-6">
        <SimpleCard
          vehicle={vehicle}
          currentUserId={currentUserId}
          key={vehicle.id}
          initialIsFavorited={favoriteVehicleIds.has(vehicle.id)}
          showDate={false}
        />
        <VehicleDetails
          vehicle={vehicle}
          currentUserId={currentUserId}
          advertiserEmail={vehicle.user?.email}
          advertiserUsername={vehicle.user?.username}
        />
      </div>

      <div className="flex flex-col w-full xl:w-1/4 gap-y-1">
        <h3 className="text-lg font-semibold px-2">
          Algunos vehículos similares
        </h3>

        {/* Contenedor del ScrollArea solo en pantallas xl */}
        <div className="relative w-full xl:block hidden overflow-y-auto h-[760px]">
          <ScrollArea className="w-full h-full overflow-y-auto" type="always">
            <div className="flex flex-row justify-center lg:flex-col gap-4 p-2 min-w-max lg:min-w-0 mr-4">
              {vehiclesOfSameBrand.map((v) => (
                <div key={v.id} className="w-[280px] lg:w-full flex-shrink-0">
                  <MoreCard
                    vehicle={v}
                    currentUserId={currentUserId}
                    initialIsFavorited={favoriteVehicleIds.has(v.id)}
                  />
                </div>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>

        {/* Mostrar los vehículos similares (solo 4) en un contenedor con wrap en pantallas pequeñas y medianas */}
        <div className="xl:hidden grid grid-cols-2 gap-4">
          {vehiclesOfSameBrand.slice(0, 4).map((v) => (
            <div key={v.id} className="w-full">
              <MoreCard
                vehicle={v}
                currentUserId={currentUserId}
                initialIsFavorited={favoriteVehicleIds.has(v.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
