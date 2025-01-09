"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DraftButton from "@/components/draft-button";
import FavoriteButton from "@/components/favorite-button";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { CircleOff } from "lucide-react";

export default function DetailsCard({
  vehicle,
  currentUserId,
  initialIsFavorited,
  isDraft,
}) {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
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
    <>
      <div>
        <Carousel className={`w-full ${isDraft ? "opacity-20" : ""}`}>
          <CarouselContent>
            <CarouselItem>
              <div className="p-0">
                <Card className="h-[500px] border-none shadow-none">
                  <CardContent className="flex items-center justify-center h-full px-0 py-4">
                    <Image
                      src={
                        vehicle.brand === "Audi"
                          ? "/images/audi-frente.webp"
                          : "/images/bmw-frente.webp"
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
                <Card className="h-[500px] border-none shadow-none">
                  <CardContent className="flex items-center justify-center h-full px-0 py-4">
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
                <Card className="h-[500px] border-none shadow-none">
                  <CardContent className="flex items-center justify-center h-full px-0 py-4">
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
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
      <Card
        className="relative w-full transition-transform 
         ease-in-out shadow-md"
      >
        <CardContent className={`${isDraft ? "opacity-20" : ""}`}>
          <div className="flex flex-row px-2 justify-between gap-x-6 w-full pt-0 pb-0 mb-4 mt-4">
            <div className="flex flex-col items-start">
              <p className="text-muted-foreground text-sm">Precio al contado</p>
              <p className="text-lg font-bold">
                {formatMiles(vehicle.price)}
                <span className="text-sm"> €</span>
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-muted-foreground text-sm">Precio financiado</p>
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
            <div
              className="flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <FavoriteButton
                vehicle={vehicle}
                initialIsFavorited={isFavorited}
                onError={handleError}
                onSuccess={handleSuccess}
                onToggleFavorited={(status) => setIsFavorited(status)}
              />
            </div>
          </div>

          <div className="flex w-full px-2 items-center justify-between">
            <CardTitle className="text-xl flex-col md:flex-row justify-center items-center w-full ">
              <div className="flex flex-wrap w-full mb-2 justify-between items-center">
                <span>
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
        </CardContent>
        <CardFooter
          className={`flex flex-wrap justify-between gap-4 p-4 ${
            isDraft ? "opacity-100" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs text-muted-foreground underline decoration-1 font-semibold">
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
              />

              <div className="relative w-full xl:w-auto">
                <Link
                  href={`/vehicle/${vehicle.id}/edit`}
                  passHref
                  className="flex items-center"
                >
                  <Button variant="outline" className="w-full xl:w-auto">
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
              <CircleOff className="text-red-500 text-4xl" />
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
    </>
  );
}
