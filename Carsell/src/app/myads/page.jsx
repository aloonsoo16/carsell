import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/libs/db";
import VehicleTable from "./vehicle-table";
import CreateButton from "@/components/create-button";

async function getData() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!session) {
    return null;
  }

  const vehicles = await db.vehicle.findMany({
    where: {
      userId: currentUserId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return vehicles.map((vehicle) => {
    const createdAt = new Date(vehicle.createdAt).toLocaleString();
    const updatedAt = new Date(vehicle.updatedAt).toLocaleString();

    return {
      id: vehicle.id,
      status: vehicle.isDraft ? "Inactivo" : "Activo",
      brand: vehicle.brand,
      model: vehicle.model,
      version: vehicle.version,
      date:
        createdAt !== updatedAt
          ? `Editado el ${updatedAt}`
          : `Creado el ${createdAt}`, 
    };
  });
}

export default async function DemoPage() {
  const data = await getData();
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!data) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="text-sm font-semibold">
            Debes iniciar sesión para poder ver tus anuncios
          </h2>
        </div>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <div>
          <h2 className="flex flex-col justify-center items-center gap-y-2 text-sm font-semibold">
            No has publicado ningún anuncio. Publica uno ahora
            <CreateButton />
          </h2>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 gap-y-6">
      <div className="lg:grid lg:grid-cols-1 lg:space-y-0 space-y-6 gap-4 px-6 py-4 lg:py-16">
        <VehicleTable initialData={data} />
      </div>
    </div>
  );
}
