"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const getButtonColor = (value, isSelected) => {
  const baseStyles = "px-3 py-3 rounded-full border-2"; // El estilo base de los botones

  switch (value) {
    case "Amarillo":
      return `${baseStyles} bg-yellow-300 hover:bg-yellow-300 h-2 w-2 ${
        isSelected ? "border-2 h2 w-2 border-primary rounded-full" : ""
      }`;
    case "Azul":
      return `${baseStyles} bg-cyan-300 hover:bg-cyan-300 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Beige":
      return `${baseStyles} bg-orange-100 hover:bg-orange-100  h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Blanco":
      return `${baseStyles} bg-neutral-50 hover:bg-neutral-50 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Granate":
      return `${baseStyles} bg-red-900 hover:bg-red-900 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Gris/Plata":
      return `${baseStyles} bg-zinc-400 hover:bg-zinc-400 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Marrón":
      return `${baseStyles} bg-amber-900 hover:bg-amber-900 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Naranja":
      return `${baseStyles} bg-orange-600 hover:bg-orange-600 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Negro":
      return `${baseStyles} bg-neutral-950 hover:bg-neutral-950 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Rojo":
      return `${baseStyles} bg-red-700 hover:bg-red-700 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Rosa":
      return `${baseStyles} bg-red-400 hover:bg-red-400 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Verde":
      return `${baseStyles} bg-green-500 hover:bg-green-500 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    case "Violeta/Lila":
      return `${baseStyles} bg-violet-600 hover:bg-violet-600 h-2 w-2 ${
        isSelected ? "border-2  h-2 w-2 border-primary rounded-full" : ""
      }`;
    default:
      return isSelected ? "rounded-full" : ""; // Si no está seleccionado no se muestra rounded-full
  }
};

export function MultiSelectButtonGroup({ options, selectedValues, onSelect }) {
  const handleSelect = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value) // Quitar la opción si ya estaba seleccionada
      : [...selectedValues, value]; // Añadir la opción si no estaba seleccionada
    onSelect(newSelectedValues);
  };

  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:w-full w-85 ms-4 md:ms-0">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <Button
            key={option.value}
            variant={isSelected ? "secondary" : "outline"} // Cambiar el variant cuando el botón está seleccionado
            onClick={() => handleSelect(option.value)}
            className={cn(
              "px-2 py-2 rounded-md text-muted-foreground",
              getButtonColor(option.value, isSelected) // Asignar el color basado en la selección
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
