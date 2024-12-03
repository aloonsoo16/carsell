"use server";

import { getServerSession } from "next-auth/next";
import db from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await req.json();
    const vehicleId = body.id;

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Id del vehículo no proporcionado" },
        { status: 400 }
      );
    }

    // Obtener los detalles del vehículo único
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 }
      );
    }

    if (vehicle.userId !== userId) {
      return NextResponse.json({ error: "Inautorizado" }, { status: 403 });
    }

    // Alternar el estado isDraft
    vehicle.isDraft = !vehicle.isDraft;

    // Guardar los cambios en la base de datos
    await db.vehicle.update({
      where: { id: vehicleId },
      data: { isDraft: vehicle.isDraft },
    });

    // Respuesta con el mensaje y los datos del vehículo
    return NextResponse.json({
      message: `Anuncio "${vehicle.brand} ${vehicle.model} ${
        vehicle.version
      }"  ${vehicle.isDraft ? "enviado a borrador" : "publicado de nuevo"} exitosamente`,
      vehicle,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al modificar el estado del anuncio",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
