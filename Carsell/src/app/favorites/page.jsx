"use server";

import React from "react";
import db from "@/libs/db";
import SimpleCard from "@/components/simple-card";
import AddFavorites from "@/components/add-favorites";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PaginationComponent from "@/components/pagination";

async function UserFavorites({ searchParams }) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const vehiclesPerPage = 6; // Número de vehículos por página
  const currentPage = parseInt(params.page) || 1; // Obtener la página actual

  // Calcular el offset para la paginación
  const offset = (currentPage - 1) * vehiclesPerPage;

  // Si no hay sesión, mostrar un mensaje indicándolo
  if (!session) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="text-sm font-semibold">
            Debes iniciar sesion para ver tus vehículos favoritos
          </h2>
        </div>
      </section>
    );
  }

  // Obtener favoritos del usuario con sesión actual
  const favorites = await db.favorite.findMany({
    where: {
      userId: currentUserId,
    },
  });

  // Si el usuario no tiene favoritos, mostrar un mensaje indicándolo
  if (favorites.length === 0) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="flex flex-col justify-center items-center gap-y-2 font-bold text-sm">
            No tienes vehículos favoritos. ¡Agrega algunos!
            <AddFavorites />
          </h2>
        </div>
      </section>
    );
  }

  // Obtener los IDs de los vehículos favoritos del usuario
  const favoriteVehicleIds = new Set(favorites.map((f) => f.vehicleId));

  // Obtener los vehículos favoritos con su respectiva paginación
  const vehicles = await db.vehicle.findMany({
    where: {
      id: {
        in: Array.from(favoriteVehicleIds),
      },
    },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
    skip: offset, // Aplicar el offset para la paginación
    take: vehiclesPerPage, // Limitar la cantidad de vehículos por página
    orderBy: {
      updatedAt: "desc", // Ordenar por la fecha de actualización
    },
  });

  // Calcular la paginación
  const totalPages = Math.ceil(favoriteVehicleIds.size / vehiclesPerPage); // Total de páginas para mostrar

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-6 py-4 md:py-2">
      <div className="lg:grid md:grid-cols-2 xl:grid-cols-3 lg:space-y-0 space-y-6 gap-4">
        {vehicles.map((vehicle) => (
          <SimpleCard
            vehicle={vehicle}
            currentUserId={currentUserId}
            key={vehicle.id}
            initialIsFavorited={true}
            advertiserUsername={vehicle.user.username}
            isDraft={vehicle.isDraft} // Pasa el estado isDraft al SimpleCard para mostrar también los vehículos que estén en borrador
            showDate={true} // Mostrar la fecha 
          />
        ))}
      </div>
      <div className="w-full py-4 mt-1">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default UserFavorites;
