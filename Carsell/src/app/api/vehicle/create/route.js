"use server";
import { getServerSession } from "next-auth/next";
import db from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No se ha encontrado ninguna sesión" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const formData = await req.formData();
    const brand = formData.get("brand")?.toString();
    const model = formData.get("model")?.toString();
    const version = formData.get("version")?.toString();
    const price = parseFloat(formData.get("price")?.toString());
    const province = formData.get("province")?.toString();
    const kilometers = parseInt(formData.get("kilometers")?.toString());
    const bodyType = formData.get("bodyType")?.toString();
    const color = formData.get("color")?.toString();
    const transmission = formData.get("transmission")?.toString();
    const fuelType = formData.get("fuelType")?.toString();
    const label = formData.get("label")?.toString();
    const traction = formData.get("traction")?.toString();
    const power = parseInt(formData.get("power")?.toString());
    const displacement = parseFloat(formData.get("displacement")?.toString());
    const doors = parseInt(formData.get("doors")?.toString());
    const seats = parseInt(formData.get("seats")?.toString());
    const comment = formData.get("comment")?.toString();
    const year = parseInt(formData.get("year")?.toString());

    // Obtener las características (features) como array
    const features = formData.getAll("features");

    // Convertir el array de características en una cadena separada por comas
    const featuresString = features.length > 0 ? features.join(", ") : "";

    // Crear un nuevo vehículo en la base de datos
    const newVehicle = await db.vehicle.create({
      data: {
        brand,
        model,
        version,
        price,
        province,
        kilometers,
        bodyType,
        color,
        transmission,
        fuelType,
        label,
        traction,
        power,
        displacement,
        doors,
        seats,
        features: featuresString, // Guardar como una cadena de texto separada por comas
        comment,
        userId,
        year,
      },
    });

    console.log("Vehiculo creado:", newVehicle);
    return NextResponse.json(
      { message: "Tu anuncio ha sido publicado exitósamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error al crear el anuncio", error);
    return NextResponse.json(
      { error: "Error al crear el anuncio" },
      { status: 500 }
    );
  }
}
