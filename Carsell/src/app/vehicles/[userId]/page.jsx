"use server";

import db from "@/libs/db";
import SimpleCard from "@/components/simple-card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PaginationComponent from "@/components/pagination";

export default async function UserVehiclesPage({ params, searchParams }) {
  const { userId } = await params; // Obtener userId de params
  const { page } = await searchParams; // Obtener la página de searchParams

  // Obtener la sesión actual
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  // Establecer el número de vehículos por página y la página actual
  const vehiclesPerPage = 6;
  const currentPage = parseInt(page) || 1; // Si no se pasa una página, usar la 1

  // Verificar si el usuario existe antes de proceder
  const user = await db.user.findUnique({
    where: { id: parseInt(userId) },
    select: { id: true, username: true },
  });

  // Si el usuario no existe, mostrar un mensaje y no continuar con la consulta de vehículos
  if (!user) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="font-semibold text-sm">No existe este usuario</h2>
        </div>
      </section>
    );
  }

  // Obtener todos los vehículos del usuario específico que no estén en borrador
  const vehicles = await db.vehicle.findMany({
    where: {
      userId: parseInt(userId),
      isDraft: false,
    },
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

  // Si no hay vehículos publicados por el usuario indicarlo
  if (vehicles.length === 0) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="flex justify-center items-center gap-1">
            <div className="capitalize text-sm font-semibold">
              {user.username}
            </div>
            <div className="text-sm font-semibold">
              no tiene anuncios publicados en este momento
            </div>
          </h2>
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

  const favoriteVehicleIds = new Set(favorites.map((f) => f.vehicleId)); // Crear un conjunto de IDs de los vehículos favoritos del usuario para mostrar correctamente el estado en el simplecard

  // Calcular la paginación
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage); // Total de páginas
  const startIndex = (currentPage - 1) * vehiclesPerPage; // Índice inicial para la página actual
  const currentVehicles = vehicles.slice(
    startIndex,
    startIndex + vehiclesPerPage
  );
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
