"use server";

import { getServerSession } from "next-auth/next";
import db from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión para agregar a favoritos" }, { status: 401 });
  }

  try {
    const { vehicleId } = await req.json();
    const userId = session.user.id;

    if (!vehicleId) {
      return NextResponse.json(
        { error: "ID de vehículo no proporcionado" },
        { status: 400 }
      );
    }

    // Buscar el vehículo en la base de datos
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      select: { brand: true, model: true, version: true }, // Seleccionamos solo los datos que necesitamos
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el vehículo ya está en favoritos
    const favorite = await db.favorite.findFirst({
      where: { userId, vehicleId },
    });

    if (favorite) {
      // Si existe, eliminar de favoritos
      await db.favorite.delete({ where: { id: favorite.id } });
      return NextResponse.json(
        {
          message: `${vehicle.brand} ${vehicle.model} ${vehicle.version} eliminado de favoritos`,
          isFavorited: false,
        },
        { status: 200 }
      );
    } else {
      // Si no existe, agregar a favoritos
      await db.favorite.create({
        data: { userId, vehicleId },
      });
      return NextResponse.json(
        {
          message: `${vehicle.brand} ${vehicle.model} ${vehicle.version} agregado a favoritos`,
          isFavorited: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar favoritos" },
      { status: 500 }
    );
  }
}

