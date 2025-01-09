"use server";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const vehicle = await db.vehicle.findUnique({
      where: { id: parseInt(id) },
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
      return NextResponse.json(
        { error: "No existe el vehículo con el id " + id },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los detalles del vehículo" },
      { status: 500 }
    );
  }
}
