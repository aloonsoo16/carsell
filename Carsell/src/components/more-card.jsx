"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";
import { CircleOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MoreCard({ vehicle, isDraft }) {
  const formatMiles = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(".") : arr[0];
  };

  return (
    <div className="relative w-full cursor-pointer">
      <Link
        href={`/vehicle/${vehicle.id}/details`}
        id={`redirect-link-${vehicle.id}`}
      >
        <Card className="relative w-50  transition-all duration-300 ease-in-out shadow-md hover:border-primary/30">
          <Carousel className={`w-full ${isDraft ? "opacity-20" : ""}`}>
            <CarouselContent>
              <CarouselItem>
                <div className="p-0">
                  <Card className="h-24 border-none shadow-none">
                    <CardContent className="flex items-center justify-center h-full p-2">
                      <Image
                        src={
                          vehicle.brand === "Audi"
                            ? "/images/audi-frente.webp"
                            : "/images/bmw-frente.webp"
                        }
                        width={500} // Ancho de la imagen
                        height={300} // Alto de la imagen
                        alt={vehicle.brand === "Audi" ? "Audi" : "BMW"}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="p-0">
                  <Card className="h-24 border-none shadow-none">
                    <CardContent className="flex items-center justify-center h-full p-2">
                      <Image
                        src={
                          vehicle.brand === "Audi"
                            ? "/images/audi-lado.webp"
                            : "/images/bmw-atras.webp"
                        }
                        width={500} // Ancho de la imagen
                        height={300} // Alto de la imagen
                        alt={vehicle.brand === "Audi" ? "Audi" : "BMW"}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="p-0">
                  <Card className="h-24 border-none shadow-none">
                    <CardContent className="flex items-center justify-center h-full p-2">
                      <Image
                        src={
                          vehicle.brand === "Audi"
                            ? "/images/audi-motor.webp"
                            : "/images/bmw-llanta.webp"
                        }
                        width={500} // Ancho de la imagen
                        height={300} // Alto de la imagen
                        alt={vehicle.brand === "Audi" ? "Audi" : "BMW"}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          <CardTitle className="px-4 py-2 truncate">
            {vehicle.brand} {vehicle.model} {vehicle.version}
          </CardTitle>

          <div className={`${isDraft ? "opacity-20" : "px-2"}`}>
            <div className="flex flex-row px-2 justify-between gap-x-6 w-full pt-0 pb-0 ">
              <div className="flex flex-col items-start">
                <p className="text-muted-foreground text-sm">
                  Precio al contado
                </p>
                <p className="font-bold">
                  {formatMiles(vehicle.price)}
                  <span className="text-sm"> €</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-start px-2 mb-4">
              <div className="text-muted-foreground text-sm flex items-center flex-wrap gap-2">
                {formatMiles(vehicle.kilometers)} km
                <Separator orientation="vertical" className="mx-2 h-4" />
                {vehicle.year}
              </div>
            </div>
          </div>

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
      </Link>
    </div>
  );
}
