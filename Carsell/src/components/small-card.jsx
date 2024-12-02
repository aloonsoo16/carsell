import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

//pasamos props para modificar cada respectivo smallcard que se va a utilizar
export default function SmallCard({ title, logoUrl, link, icon }) {
  return (
    <div className="h-[180px]">
      <Link href={link} passHref>
        <Card className="relative w-[300px] bg-secondary/70  border-transparent  max-w-sm cursor-pointer hover:scale-105 hover:bg-secondary transition-transform duration-300 ease-in-out shadow-md">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-background rounded-full flex items-center justify-center shadow-md z-10 ml-2">
            <Image
              src={logoUrl}
              width={500}
              height={300} 
              alt={`${title} logo`}
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
          <CardHeader className="py-8 mb-10">
            <CardTitle className="text-lg font-semibold flex justify-between items-center">
              <span>{title}</span>
              <div className="rounded-full bg-background p-2">{icon}</div>
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
