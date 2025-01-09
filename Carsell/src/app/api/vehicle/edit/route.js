"use server";
import { getServerSession } from "next-auth/next";
import db from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  try {
    const userId = session.user.id;
    const formData = await req.formData();
    const vehicleId = formData.get("id")?.toString(); //Obtener el ID del vehículo

    // Verifica si el vehículo existe y si el usuario es el propietario
    const vehicle = await db.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }, // Convertir el ID a número entero
    });

    if (!vehicle || vehicle.userId !== userId) {
      return NextResponse.json(
        { error: "No tienes permiso para editar este anuncio" },
        { status: 403 }
      );
    }


    const features = formData.getAll("features"); // Obtener todas las opciones seleccionadas como array
    const featuresString = features.join(", "); // Convertirlo en un string separado por comas

    const editedVehicleData = {
      brand: formData.get("brand")?.toString(),
      model: formData.get("model")?.toString(),
      version: formData.get("version")?.toString(),
      price: parseFloat(formData.get("price")?.toString()),
      province: formData.get("province")?.toString(),
      kilometers: parseInt(formData.get("kilometers")?.toString()),
      bodyType: formData.get("bodyType")?.toString(),
      color: formData.get("color")?.toString(),
      transmission: formData.get("transmission")?.toString(),
      fuelType: formData.get("fuelType")?.toString(),
      label: formData.get("label")?.toString(),
      traction: formData.get("traction")?.toString(),
      power: parseInt(formData.get("power")?.toString()),
      displacement: parseFloat(formData.get("displacement")?.toString()),
      doors: parseInt(formData.get("doors")?.toString()),
      seats: parseInt(formData.get("seats")?.toString()),
      features: featuresString, // Guardar las características como un string
      comment: formData.get("comment")?.toString(),
      year: parseInt(formData.get("year")?.toString()), 
    };

    // Verificar si hay cambios
    const isChanged = Object.keys(editedVehicleData).some(
      (key) => editedVehicleData[key] !== vehicle[key]
    );

    if (!isChanged) {
      return NextResponse.json(
        { message: "No has realizado ningun cambio" },
        { status: 200 }
      );
    }

    // Actualizar el vehículo solo si hay cambios
    const updatedVehicle = await db.vehicle.update({
      where: { id: parseInt(vehicleId) }, // Usar el ID para actualizar el vehículo correspondiente
      data: editedVehicleData,
    });

    console.log("Anuncio editado:", vehicleId);
    console.log(updatedVehicle);
    return NextResponse.json(
      {
        message: `Tu anuncio ${updatedVehicle.brand} ${updatedVehicle.model} ha sido editado exitosamente`,
        vehicle: updatedVehicle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error al editar el anuncio:", error);
    return NextResponse.json(
      { error: "Error al editar el anuncio" },
      { status: 500 }
    );
  }
}
