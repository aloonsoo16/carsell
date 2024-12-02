import db from "@/libs/db";

export async function GET() { //Obtener todos los vehículos
  try {
    const vehicles = await db.vehicle.findMany({});
    return new Response(JSON.stringify(vehicles), { status: 200 });
  } catch (error) {
    console.error("Error al encontrar vehículos", error);
    return new Response("Error al encontrar vehículos", { status: 500 });
  }
}
