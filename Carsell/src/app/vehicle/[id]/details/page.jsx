import React from "react";
import db from "@/libs/db";
import VehicleDetails from "@/components/vehicle-details";
import DetailsCard from "@/components/details-card";
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

  const vehiclesOfSameBrand = await db.vehicle.findMany({
    where: {
      brand: vehicle.brand,
      id: { not: vehicle.id },
    },
    take: 10,
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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4  lg:px-12">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <DetailsCard
            vehicle={vehicle}
            currentUserId={currentUserId}
            key={vehicle.id}
            initialIsFavorited={favoriteVehicleIds.has(vehicle.id)}
          />
        </div>
        <div className="lg:col-span-1">
          <VehicleDetails
            vehicle={vehicle}
            currentUserId={currentUserId}
            advertiserEmail={vehicle.user?.email}
            advertiserUsername={vehicle.user?.username}
          />
        </div>
      </div>

      <div className="mb-12 md:mb-4s
      ">
        <h2 className="font-bold pb-8">Algunos vehículos similares</h2>
        <ScrollArea className="w-full whitespace-normal" type="always">
          <div className="flex space-x-4 pb-8">
            {vehiclesOfSameBrand.map((v) => (
              <div key={v.id} className="w-[280px] flex-shrink-0">
                <MoreCard
                  vehicle={v}
                  currentUserId={currentUserId}
                  initialIsFavorited={favoriteVehicleIds.has(v.id)}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
