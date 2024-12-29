"use server";

import db from "@/libs/db";
import SimpleCard from "@/components/simple-card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PaginationComponent from "@/components/pagination";

export default async function AllVehiclesPage({ searchParams }) {
  // Obtener la sesión actual para acceder al ID del usuario
  await new Promise((resolve) => setTimeout(resolve, 500));
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const params = await searchParams;
  const vehiclesPerPage = 6; // Número de vehículos por página
  const currentPage = parseInt(params.page) || 1; // Obtener la página actual de los parámetros

  // Obtener todos los vehículos que no están en borrador (los de borrador no se muestran)
  const vehicles = await db.vehicle.findMany({
    where: { isDraft: false },
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  // Si no hay vehículos publicados por el usuario mostrar mensaje indicándolo
  if (vehicles.length === 0) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="font-semibold text-sm">No hay anuncios publicados</h2>
        </div>
      </section>
    );
  }

  // Obtener los favoritos del usuario actual
  const favorites = currentUserId
    ? await db.favorite.findMany({
        where: {
          userId: currentUserId,
        },
      })
    : [];

  const favoriteVehicleIds = new Set(favorites.map((f) => f.vehicleId)); // Crear un conjunto de IDs de vehículos favoritos

  // Calcular la paginación
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage); // Total de páginas
  const startIndex = (currentPage - 1) * vehiclesPerPage; // Índice inicial para la página actual
  const currentVehicles = vehicles.slice(
    startIndex,
    startIndex + vehiclesPerPage
  ); // Obtener los vehículos para la página actual

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-6 py-4 md:py-2">
      <div className="lg:grid md:grid-cols-2 xl:grid-cols-3 lg:space-y-0 space-y-6 gap-4">
        {currentVehicles.map((vehicle) => (
          <SimpleCard
            vehicle={vehicle}
            currentUserId={currentUserId}
            key={vehicle.id}
            initialIsFavorited={favoriteVehicleIds.has(vehicle.id)}
            advertiserEmail={vehicle.user.email}
            advertiserUsername={vehicle.user.username}
            showDate={true}
          />
        ))}
      </div>

      {/* Paginación dentro del footer */}
      <div className="w-full py-4 mt-1">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
