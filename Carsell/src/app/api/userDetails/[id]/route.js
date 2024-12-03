"use server";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Consultar el usuario en la base de datos
    const user = await db.user.findUnique({
      where: { id: parseInt(id) }, // Obtener usuario por su ID
      select: { username: true }, // Obtener el nombre de usuario
    });

    if (!user) {
      return NextResponse.json(
        { error: "No existe el usuario con el id " + id },
        { status: 404 }
      );
    }

    return NextResponse.json(user); // Devuelve el nombre de usuario
  } catch (error) {
    console.error("Error al obtener los detalles del usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener los detalles del usuario" },
      { status: 500 }
    );
  }
}
