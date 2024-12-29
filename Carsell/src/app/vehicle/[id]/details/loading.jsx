import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Asegúrate de importar Skeleton
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Asegúrate de importar los componentes

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-4 lg:px-12">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Skeleton className="h-[300px] w-full rounded-lg" />{" "}
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-lg" />{" "}
        </div>
      </div>

      <div>
        <ScrollArea className="w-full" type="always">
          <div className="flex space-x-4 pb-8">
            {/* Esqueleto para los vehículos similares */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-[280px] flex-shrink-0">
                <Skeleton className="h-40 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
