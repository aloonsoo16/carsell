"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import DraftButton from "@/components/draft-button";
import FavoriteButton from "@/components/favorite-button";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";
import { CircleOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SimpleCard({
  vehicle,
  currentUserId,
  initialIsFavorited,
  showDate,
  isDraft,
  advertiserUsername,
}) {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  const createdAt = new Date(vehicle.createdAt).toLocaleString();
  const updatedAt = new Date(vehicle.updatedAt).toLocaleString();

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setMessage(null);
  };

  const handleSuccess = (successMessage) => {
    setMessage(successMessage);
    setError(null);
  };

  const formatMiles = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(".") : arr[0];
  };

  return (
    <div className="relative w-full">
      <Card className="relative w-full transition-all duration-300 ease-in-out shadow-md hover:border-primary/30">
        <Carousel className={`w-full ${isDraft ? "opacity-20" : ""}`}>
          <CarouselContent>
            <CarouselItem>
              <div className="p-0">
                <Card className="h-48 border-none shadow-none">
                  <CardContent className="flex items-center justify-center h-full p-2">
                    <Image
                      src={
                        vehicle.brand === "Audi"
                          ? "/images/audi-frente.webp"
                          : "/images/bmw-frente.webp"
                      }
                      width={2000}
                      height={2000}
                      alt={vehicle.brand === "Audi" ? "Audi" : "BMW"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="p-0">
                <Card className="h-48 border-none shadow-none">
                  <CardContent className="flex items-center justify-center h-full p-2">
                    <Image
                      src={
                        vehicle.brand === "Audi"
                          ? "/images/audi-lado.webp"
                          : "/images/bmw-atras.webp"
                      }
                      width={2000} // Ancho de la imagen
                      height={2000} // Alto de la imagen
                      alt={vehicle.brand === "Audi" ? "Audi" : "BMW"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="p-0">
                <Card className="h-48 border-none shadow-none">
                  <CardContent className="flex items-center justify-center h-full p-2">
                    <Image
                      src={
                        vehicle.brand === "Audi"
                          ? "/images/audi-motor.webp"
                          : "/images/bmw-llanta.webp"
                      }
                      width={2000} // Ancho de la imagen
                      height={2000} // Alto de la imagen
                      alt={vehicle.brand === "Audi" ? "Audi" : "BMW"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <Link
          href={`/vehicle/${vehicle.id}/details`}
          passHref
          onClick={(e) => {
            if (e.target.closest(".favorite-button")) {
              e.preventDefault();
            }
          }}
        ></Link>
        <CardContent className={`${isDraft ? "opacity-20" : ""}`}>
          <div className="flex flex-row px-2 justify-between gap-x-6 w-full pt-0 pb-0 mb-4 mt-2">
            <Link href={`/vehicle/${vehicle.id}/details`} passHref>
              <div className="flex flex-row gap-x-8">
                <div className="flex flex-col items-start">
                  <p className="text-muted-foreground text-sm">
                    Precio al contado
                  </p>
                  <p className="text-lg font-bold">
                    {formatMiles(vehicle.price)}
                    <span className="text-sm"> €</span>
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-muted-foreground text-sm">
                    Precio financiado
                  </p>
                  <p className="text-lg font-bold">
                    {(vehicle.price / 24)
                      .toFixed(2)
                      .replace(".", ",")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      .replace(/,00$/, "")}{" "}
                    <span className="text-sm"> €</span>
                    <span className="text-xs">/mes* </span>
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex flex-col items-center">
              <FavoriteButton
                vehicle={vehicle}
                initialIsFavorited={isFavorited}
                onError={handleError}
                onSuccess={handleSuccess}
                onToggleFavorited={(status) => setIsFavorited(status)}
                onClick={(e) => {
                  e.stopPropagation(); 
                }}
              />
            </div>
          </div>

          <Link href={`/vehicle/${vehicle.id}/details`} passHref>
            <div className="flex w-full px-2 mb-4 items-center justify-between">
              <CardTitle className="text-xl flex-col md:flex-row justify-center items-center w-full ">
                <div className="flex flex-wrap w-full mb-2 justify-between items-center">
                  <span className="lg:truncate">
                    {vehicle.brand} {vehicle.model} {vehicle.version}
                  </span>
                </div>
                <Separator orientation="horizontal" className="w-full mb-2" />
                <div className="flex gap-x-4">
                  <p className="text-teal-custom text-sm">Garantía incluida</p>
                  <Separator orientation="vertical" className="h-4" />
                  <p className="text-teal-custom text-sm">IVA Incluido</p>
                </div>
              </CardTitle>
            </div>

            <div className="flex flex-wrap items-center justify-start px-2 gap-4 mb-4">
              <p className="text-muted-foreground text-sm">
                {vehicle.province}
              </p>
              <Separator orientation="vertical" className="h-4" />
              <p className="text-muted-foreground text-sm">
                {formatMiles(vehicle.kilometers)} km
              </p>
              <Separator orientation="vertical" className="h-4" />
              <p className="text-muted-foreground text-sm">{vehicle.year}</p>
              <Separator orientation="vertical" className="h-4" />
              <p className="text-muted-foreground text-sm">
                {vehicle.fuelType}
              </p>
            </div>

            <div className="flex justify-start items-center px-2">
              {showDate && (
                <div className="text-xs font-semibold">
                  {createdAt !== updatedAt ? (
                    <p>Editado el {updatedAt}</p>
                  ) : (
                    <p>Publicado el {createdAt}</p>
                  )}
                  <p>
                    por <span className="capitalize">{advertiserUsername}</span>
                  </p>
                </div>
              )}
            </div>
          </Link>
        </CardContent>

        <Separator />
        <CardFooter
          className={`flex flex-wrap justify-between gap-4 p-4 ${
            isDraft ? "opacity-100" : ""
          }`}
        >
          <p className="py-2 text-xs text-muted-foreground underline decoration-1 font-semibold">
            * 24 cuotas sin intereses
          </p>

          {vehicle.userId === currentUserId && (
            <div className="flex w-full flex-col xl:flex-row xl:w-auto justify-center gap-2">
              <DraftButton
                vehicle={vehicle}
                isDraft={isDraft}
                onError={handleError}
                onSuccess={handleSuccess}
                buttonText={isDraft ? `Reactivar` : `Eliminar anuncio`}
                alertTitle={
                  isDraft
                    ? `¿Reactivar el anuncio ${vehicle.brand} ${vehicle.model} ${vehicle.version}?`
                    : `¿Eliminar el anuncio ${vehicle.brand} ${vehicle.model} ${vehicle.version}?`
                }
                alertDescription={
                  isDraft
                    ? `Este anuncio "${vehicle.brand} ${vehicle.model} ${vehicle.version}" se reactivará y estará disponible de nuevo.`
                    : `Este anuncio "${vehicle.brand} ${vehicle.model} ${vehicle.version}" pasará a estar inactivo de manera permanente. Podras volver a publicarlo en un futuro si lo deseas.`
                }
                confirmButtonText={isDraft ? "Reactivar" : "Eliminar"}
                onClick={(e) => e.stopPropagation()}
              />

              <div className="relative w-full xl:w-auto">
                <Link
                  href={`/vehicle/${vehicle.id}/edit`}
                  passHref
                  className="flex items-center"
                >
                  <Button
                    variant="outline"
                    className="w-full xl:w-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardFooter>

        {isDraft && (
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="text-red-500 text-4xl">
                <CircleOff />
              </div>
              <span className="font-semibold mt-2">
                Este anuncio ya no esta disponible
              </span>
              <p className="flex font-semibold flex-wrap items-center justify-center text-center px-10 text-muted-foreground text-sm">
                <i>
                  *Tal vez sea activado de nuevo, pero puedes eliminarlo de
                  favoritos si lo deseas
                </i>
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
