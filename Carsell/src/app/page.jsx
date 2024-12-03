"use server";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SmallCard from "@/components/small-card";
import SimpleFilter from "@/components/simple-filter";
import {
  Fuel,
  Sparkles,
  Percent,
  Recycle,
  Users,
  CircleGauge,
  User,
} from "lucide-react";
import Link from "next/link";

async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 border-b backdrop-blur-sm bg-background/60 z-50">
        <div className="flex h-16 items-center justify-between px-4 w-full">
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold flex justify-start items-center gap-4 ml-2">
              <Link href="/home" className="flex items-center">
                <span className="text-xs md:text-sm">Ir a inicio</span>
              </Link>
              {!session && (
                <>
                  <Separator orientation="vertical" className="h-5" />
                  <Link href="/auth/login" className="flex items-center">
                    <span className="text-xs md:text-sm">Iniciar sesión</span>
                  </Link>
                  <Separator orientation="vertical" className="h-5" />
                  <Link href="/auth/register" className="flex items-center">
                    <span className="text-xs md:text-sm">Registrarse</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {session && (
            <div className="flex justify-center space-x-2 items-center">
              <p className="text-xs md:text-sm font-bold">
                {`Hola, `}
                <span className="capitalize text-xs md:text-sm">
                  {session.user.name}
                </span>
              </p>
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-secondary">
                <User size={18} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-col justify-center p-4 md:p-8">
        <div
          className="relative w-full flex flex-wrap justify-start items-center rounded-lg p-6 md:p-16"
          style={{
            backgroundImage: "url('/images/fondo.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0 bg-background/50 rounded-lg"
            style={{
              opacity: 0.8,
            }}
          ></div>

          {/* Contenido */}
          <div className="relative z-10 rounded-full w-full md:w-2/4 mb-4 md:mb-0">
            <h2 className="font-bold text-lg">Bienvenido a Carsell</h2>
            <div className="flex gap-1">
              <p className="text-sm font-semibold">
                Proyecto realizado por Alonso Mangas Alfayate
              </p>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-2/4 h-full">
            <Card className="backdrop-sepia-0 bg-background/90 border-none">
              <CardHeader>
                <CardTitle>¿Cuál es tu siguiente destino?</CardTitle>
                <CardDescription>
                  Busca alguno de nuestros vehículos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleFilter />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full px-1 py-5 md:px-5 lg:px-10">
          <ScrollArea
            className="w-full whitespace-nowrap rounded-md border-none pb-4 "
            type="always"
          >
            <div className="flex space-x-4 p-4">
              <SmallCard
                title="Nuevos"
                logoUrl="/images/bmw-llanta.webp"
                link="/filter?maxKilometers=2500"
                icon={<Sparkles size={24} />}
              />
              <SmallCard
                title="Seminuevos"
                logoUrl="/images/bmw-llanta.webp"
                link="/filter?minKilometers=5000&maxKilometers=50000"
                icon={<Percent size={24} />}
              />
              <SmallCard
                title="ECO"
                logoUrl="/images/bmw-llanta.webp"
                link="/filter?labels=Etiqueta+CERO+%28azul%29%2CEtiqueta+ECO+%28azul%2Fverde%29"
                icon={<Recycle size={24} />}
              />
              <SmallCard
                title="Combustión"
                logoUrl="/images/bmw-llanta.webp"
                link="/filter?fuelTypes=Gasolina%2CDiesel%2CHíbrido"
                icon={<Fuel size={24} />}
              />
              <SmallCard
                title="Deportivos"
                logoUrl="/images/bmw-llanta.webp"
                link="/filter?minPower=200"
                icon={<CircleGauge size={24} />}
              />
              <SmallCard
                title="Para toda la familia"
                logoUrl="/images/bmw-llanta.webp"
                link="/filter?minSeats=7"
                icon={<Users size={24} />}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="w-full px-1 py-5 md:px-5 lg:px-10 gap-4 flex flex-col">
          <span>
            La finalidad de este proyecto es interactuar con la aplicación para
            probar su funcionamiento. Los anuncios publicados no son reales.
          </span>
          <span>
            Te invito a explorar la aplicación. Es recomendable iniciar sesión
            para tener acceso total y una mejor experiencia.
          </span>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
