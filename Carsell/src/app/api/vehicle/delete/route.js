"use server";

import { getServerSession } from "next-auth/next";
import db from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Devuelve un error si no hay sesión activa
    return NextResponse.json(
      { error: "No se ha encontrado ninguna sesión" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;

    // Obtener el ID del vehículo del cuerpo de la solicitud
    const body = await req.json();
    const vehicleId = body.id;

    // Verifica si se proporcionó un ID de vehículo
    if (!vehicleId) {
      return NextResponse.json(
        { error: "Id del vehículo no proporcionado" },
        { status: 400 }
      );
    }

    // Busca el vehículo en la base de datos
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      // Devuelve un error si no se encuentra el vehículo
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (vehicle.userId !== userId) {
      // Devuelve un error si el usuario no tiene permisos para eliminar el vehículo
      return NextResponse.json({ error: "Inautorizado" }, { status: 403 });
    }

    // Primero, elimina todos los registros de favoritos relacionados
    await db.favorite.deleteMany({
      where: { vehicleId: vehicleId }, // Elimina todos los favoritos para este vehículo
    });

    // Eliminar el vehículo
    await db.vehicle.delete({
      where: { id: vehicleId },
    });

    // Retorna el mensaje con el nombre del vehículo (marca, modelo, versión)
    return NextResponse.json(
      {
        message: `Tu anuncio ${vehicle.brand} ${vehicle.model} ${vehicle.version} ha sido eliminado con éxito y no estará disponible de nuevo`,
        vehicleId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el anuncio:", error);
    return NextResponse.json(
      { error: "Error deleting vehicle", details: error.message },
      { status: 500 }
    );
  }
}
