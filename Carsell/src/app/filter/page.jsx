"use server";

import db from "@/libs/db";
import SimpleCard from "@/components/simple-card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FilterPaginationComponent from "@/components/filter-pagination";
import SheetWrapper from "@/components/sheet";

export default async function FilterPage({ searchParams }) {
  // Obtener los filtros y la página actual de searchParams
  await new Promise((resolve) => setTimeout(resolve, 500));
  const {
    page,
    fuelTypes,
    brands,
    models,
    versions,
    bodyTypes,
    minYear,
    maxYear,
    minPower,
    maxPower,
    minPrice,
    maxPrice,
    labels,
    provinces,
    minSeats,
    maxSeats,
    minDoors,
    maxDoors,
    minKilometers,
    maxKilometers,
    colors,
    transmissions,
    tractions,
    minDisplacement,
    maxDisplacement,
    features,
  } = await searchParams;

  const maxYearValue = maxYear ? parseFloat(maxYear) : undefined;
  const minYearValue = minYear ? parseFloat(minYear) : undefined;

  const maxPowerValue = maxPower ? parseFloat(maxPower) : undefined;
  const minPowerValue = minPower ? parseFloat(minPower) : undefined;
  // Convertir los precios a valores numéricos si están presentes
  const maxPriceValue = maxPrice ? parseFloat(maxPrice) : undefined;
  const minPriceValue = minPrice ? parseFloat(minPrice) : undefined;

  const maxSeatsValue = maxSeats ? parseFloat(maxSeats) : undefined;
  const minSeatsValue = minSeats ? parseFloat(minSeats) : undefined;

  const maxDoorsValue = maxDoors ? parseFloat(maxDoors) : undefined;
  const minDoorsValue = minDoors ? parseFloat(minDoors) : undefined;

  const maxKilometersValue = maxKilometers
    ? parseFloat(maxKilometers)
    : undefined;
  const minKilometersValue = minKilometers
    ? parseFloat(minKilometers)
    : undefined;

  const maxDisplacementValue = maxDisplacement
    ? parseFloat(maxDisplacement)
    : undefined;
  const minDisplacementValue = minDisplacement
    ? parseFloat(minDisplacement)
    : undefined;

  // Obtener la sesión
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const vehiclesPerPage = 6; // Número de vehículos por página
  const currentPage = parseInt(page) || 1; // Página actual, por defecto la 1

  // Filtro de precio
  let yearFilter = {};
  if (minYearValue !== undefined || maxYearValue !== undefined) {
    yearFilter = {
      year: {
        ...(minYearValue !== undefined && { gte: minYearValue }),
        ...(maxYearValue !== undefined && { lte: maxYearValue }),
      },
    };
  }

  let powerFilter = {};
  if (minPowerValue !== undefined || maxPowerValue !== undefined) {
    powerFilter = {
      power: {
        ...(minPowerValue !== undefined && { gte: minPowerValue }),
        ...(maxPowerValue !== undefined && { lte: maxPowerValue }),
      },
    };
  }

  let priceFilter = {};
  if (minPriceValue !== undefined || maxPriceValue !== undefined) {
    priceFilter = {
      price: {
        ...(minPriceValue !== undefined && { gte: minPriceValue }),
        ...(maxPriceValue !== undefined && { lte: maxPriceValue }),
      },
    };
  }

  let seatsFilter = {};
  if (minSeatsValue !== undefined || maxSeatsValue !== undefined) {
    seatsFilter = {
      seats: {
        ...(minSeatsValue !== undefined && { gte: minSeatsValue }),
        ...(maxSeatsValue !== undefined && { lte: maxSeatsValue }),
      },
    };
  }

  let doorsFilter = {};
  if (minDoorsValue !== undefined || maxDoorsValue !== undefined) {
    doorsFilter = {
      doors: {
        ...(minDoorsValue !== undefined && { gte: minDoorsValue }),
        ...(maxDoorsValue !== undefined && { lte: maxDoorsValue }),
      },
    };
  }

  let kilometersFilter = {};
  if (minKilometersValue !== undefined || maxKilometersValue !== undefined) {
    kilometersFilter = {
      kilometers: {
        ...(minKilometersValue !== undefined && { gte: minKilometersValue }),
        ...(maxKilometersValue !== undefined && { lte: maxKilometersValue }),
      },
    };
  }

  let displacementFilter = {};
  if (
    minDisplacementValue !== undefined ||
    maxDisplacementValue !== undefined
  ) {
    displacementFilter = {
      displacement: {
        ...(minDisplacementValue !== undefined && {
          gte: minDisplacementValue,
        }),
        ...(maxDisplacementValue !== undefined && {
          lte: maxDisplacementValue,
        }),
      },
    };
  }

  // Filtros de marca modelo y versión
  let brandFilter;
  let modelFilter;

  if (brands) {
    brandFilter = { brand: { in: brands.split(",") } };
  }

  if (models) {
    modelFilter = { model: { in: models.split(",") } };
  }

  // Filtro combinado de marca modelo y versión
  let brandModelFilter = {};
  if (brandFilter || modelFilter) {
    brandModelFilter = {
      AND: [],
    };
    if (brandFilter) {
      brandModelFilter.AND.push(brandFilter);
    }
    if (modelFilter) {
      brandModelFilter.AND.push(modelFilter);
    }
  }

  // Obtener los vehículos según los filtros aplicados
  const vehicles = await db.vehicle.findMany({
    where: {
      isDraft: false,
      fuelType: fuelTypes ? { in: fuelTypes.split(",") } : undefined,
      bodyType: bodyTypes ? { in: bodyTypes.split(",") } : undefined,
      version: versions ? { in: versions.split(",") } : undefined,
      label: labels ? { in: labels.split(",") } : undefined,
      color: colors ? { in: colors.split(",") } : undefined,
      transmission: transmissions
        ? { in: transmissions.split(",") }
        : undefined,
      traction: tractions ? { in: tractions.split(",") } : undefined,
      features: features ? { in: features.split(",") } : undefined,
      province: provinces ? { in: provinces.split(",") } : undefined,
      ...brandModelFilter,
      ...yearFilter,
      ...powerFilter,
      ...priceFilter,
      ...seatsFilter,
      ...doorsFilter,
      ...kilometersFilter,
      ...displacementFilter,
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

  // Obtener los favoritos del usuario con sesión actual
  const favorites = currentUserId
    ? await db.favorite.findMany({
        where: {
          userId: currentUserId,
        },
      })
    : [];

  const favoriteVehicleIds = new Set(favorites.map((f) => f.vehicleId)); // Crear un conjunto de IDs de vehículos favoritos para que se muestre correctamente si está en favoritos o no

  // Calcular la paginación
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage); // Total de páginas
  const startIndex = (currentPage - 1) * vehiclesPerPage; // Índice inicial de la página
  const currentVehicles = vehicles.slice(
    startIndex,
    startIndex + vehiclesPerPage
  ); // Vehículos para la página actual

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-6 py-4 md:py-2">
      <SheetWrapper />
      {vehicles.length === 0 ? (
        <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
          <div>
            <h2 className="font-semibold text-sm">
              No se han encontrado resultados
            </h2>
          </div>
        </section>
      ) : (
        <>
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
          <div className="w-full py-4 mt-1">
            <FilterPaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              filters={{
                fuelTypes,
                brands,
                models,
                versions,
                bodyTypes,
                minYear,
                maxYear,
                minPower,
                maxPower,
                minPrice,
                maxPrice,
                labels,
                minSeats,
                maxSeats,
                minDoors,
                maxDoors,
                minKilometers,
                maxKilometers,
                provinces,
                colors,
                transmissions,
                tractions,
                features,
                minDisplacement,
                maxDisplacement,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
