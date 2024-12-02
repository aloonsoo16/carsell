"use client";

import React from "react";

import { Card, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function VehicleDetails({
  vehicle,
  currentUserId,
  advertiserEmail,
  advertiserUsername,
}) {
  const createdAt = new Date(vehicle.createdAt).toLocaleString();
  const updatedAt = new Date(vehicle.updatedAt).toLocaleString();
  const formatMiles = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(".") : arr[0];
  };
  return (
    <Tabs defaultValue="userDetails" className="w-full mx-aut pb-4">
      <TabsList className="w-full flex justify-start gap-x-2 mb-4">
        <TabsTrigger value="vehicleDetails">
          Mas detalles del vehiculo
        </TabsTrigger>
        <TabsTrigger value="userDetails">Detalles del anunciante</TabsTrigger>
      </TabsList>
      <Card className="w-full p-2">
        <TabsContent value="vehicleDetails" className="w-full">
          <div className="flex justify-center rounded-md">
            <div className="flex flex-wrap p-10 gap-8">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Provincia</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.province}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Kilometros</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {formatMiles(vehicle.kilometers)} km
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Carroceria</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.bodyType}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Color</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.color}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Cambio</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.transmission}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Etiqueta</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.label}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Traccion</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.traction}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Potencia</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.power} cv
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Cilindrada</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {formatMiles(vehicle.displacement)} cc
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">N. Puertas</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.doors} puertas
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">N. Asientos</p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.seats}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Equipamiento adicional
                </p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {vehicle.features && vehicle.features.trim() !== ""
                    ? vehicle.features
                    : "Sin equipamiento adicional"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Fecha de {createdAt !== updatedAt ? "edición" : "creación"}:
                </p>
                <p className="mt-2 font-semibold text-sm md:text-base">
                  {createdAt !== updatedAt
                    ? `Editado en la fecha: ${updatedAt}`
                    : `Creado en la fecha: ${createdAt}`}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="userDetails" className="mt-0">
          <div className="flex flex-wrap justify-center items-center gap-2 p-4">
            <div className="px-2 py-1">
              {vehicle.userId === currentUserId ? (
                <span className="text-sm font-semibold">Anuncio tuyo</span>
              ) : (
                <span className="text-sm font-semibold">
                  {advertiserUsername}
                </span>
              )}
            </div>
            <Separator orientation="vertical" className="block h-4 " />
            <div className="px-2 py-1">
              <span className="text-sm font-semibold">{advertiserEmail}</span>
            </div>
            <Separator orientation="vertical" className="block h-4" />
            <div className="px-2 py-1">
              <span className="text-teal-custom text-sm font-semibold">
                Verificado
              </span>
            </div>
          </div>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-secondary" />
            <span className="px-4 font-semibold">
              Comentario acerca del anuncio
            </span>
            <hr className="flex-grow border-secondary" />
          </div>
          <div className="flex flex-grow items-center justify-start p-4 text-sm">
            {vehicle.comment ? (
              vehicle.comment
            ) : (
              <span className="text-muted-foreground">
                *El anunciante no ha especificado informacion adicional acerca
                de este anuncio.
              </span>
            )}
          </div>
          <Separator className="my-4" />
          <CardFooter className="flex flex-wrap justify-between gap-4 p-4">
            <div className="flex w-full flex-col xl:flex-row xl:w-full xl:justify-between justify-center gap-2">
              {vehicle.userId === currentUserId && (
                <Link
                  href={`/vehicle/${vehicle.id}/edit`}
                  passHref
                  className="flex items-center"
                >
                  <Button variant="outline" className="w-full xl:w-auto">
                    Gestionar anuncio
                  </Button>
                </Link>
              )}
              <Link
                href={`/vehicles/${vehicle.userId}`}
                passHref
                className="flex items-center"
              >
                <Button variant="outline" className="w-full xl:w-auto">
                  Ver mas vehiculos del anunciante
                </Button>
              </Link>

              <div className="flex flex-col gap-1">
                <Button
                  className="w-full lg:w-auto opacity-50"
                  type="button"
                  disabled
                >
                  Enviar mensaje
                </Button>
              </div>
            </div>
          </CardFooter>
        </TabsContent>
      </Card>
    </Tabs>
  );
}
