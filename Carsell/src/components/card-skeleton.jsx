import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";


export default function CardSkeleton() {
  return (
    <Card className="relative w-full">
      <Carousel className>
        <CarouselContent>
          <CarouselItem>
            <div className="p-0">
              <Card className="h-24 border-none">
                <CardContent className="flex items-center justify-center h-full p-2">
                  <div
                    className="w-full h-full object-cover bg-secondary rounded" 
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <CardContent>
        <div className="flex flex-row p-2 justify-end w-full  mb-4 mt-2 bg-secondary rounded-lg">
          <div className="w-6 h-6 bg-muted-foreground rounded-full" />
        </div>

        <div className="flex w-full px-2 mb-4 items-center justify-between">
          <CardTitle className="text-xl flex-col md:flex-row justify-center items-center w-full">
            <div className="flex w-full mb-2 bg-secondary rounded-lg text-secondary">
              Nombre del vehiculo
            </div>
            <Separator orientation="horizontal" className="w-full mb-2" />
            <div className="flex gap-x-4">
              <p className="bg-teal-custom text-teal-custom rounded-lg text-sm">
                Garantia Incluida
              </p>
              <Separator orientation="vertical" className="h-4" />
              <p className="text-teal-custom bg-teal-custom rounded-lg text-sm">
                IVA Incluido
              </p>
            </div>
          </CardTitle>
        </div>

        <div className="flex flex-wrap items-center justify-start px-2 gap-4 mb-4">
          <CardDescription className="bg-muted-foreground text-muted-foreground rounded-lg">
            123
          </CardDescription>
          <Separator orientation="vertical" className="h-4" />

          <CardDescription className="bg-muted-foreground text-muted-foreground rounded-lg">
            123
          </CardDescription>
          <Separator orientation="vertical" className="h-4" />

          <CardDescription className="bg-muted-foreground text-muted-foreground rounded-lg">
            123
          </CardDescription>
          <Separator orientation="vertical" className="h-4" />

          <CardDescription className="bg-muted-foreground text-muted-foreground rounded-lg">
            123
          </CardDescription>
          <Separator orientation="vertical" className="h-4" />
          <CardDescription className="bg-muted-foreground text-muted-foreground rounded-lg">
            Combustible
          </CardDescription>
        </div>

        <div className="flex justify-start items-center px-2 bg-secondary text-secondary rounded-lg">
          Editado el xxx xxx xx xxx xx:xx:xx GMT+0100 (hora estándar de Europa
          central)
        </div>
      </CardContent>

      <Separator />
      <CardFooter className="flex flex-wrap justify-between gap-4 p-4">
        <p className="py-2 text-secondary bg-secondary rounded-lg">
          Este vehículo xx está en favoritos
        </p>
        <div className="flex w-full flex-col xl:flex-row xl:w-auto justify-center gap-2">
          <Button className="text-transparent bg-secondary"variant="outline">Reactivar</Button>
          <Button className="text-transparent bg-secondary"variant="outline">Editar</Button>
        </div>
      </CardFooter>
      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none">
        <div className="flex flex-col items-center">
          <span className="font-semibold mt-2"></span>
          <CardDescription className="flex font-semibold flex-wrap items-center justify-center text-center px-10"></CardDescription>
        </div>
      </div>
    </Card>
  );
}
