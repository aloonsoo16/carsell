"use client"; 

import { useSheet } from "@/context/sheet-provider"; // Usar el context
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import VehicleFilter from "@/components/filter";

export default function SheetWrapper() {
  const { openSheet, setOpenSheet } = useSheet(); // Obtener el estado del Sheet desde el context

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent className="w-full max-w-lg overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Selecciona las opciones que desees.
          </SheetDescription>
          <VehicleFilter />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
