"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SimpleCombobox({
  options,
  selectedValues,
  onSelect,
  placeholder,
  isMax = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleSelect = (value) => {
    const newValue = selectedValues[0] === value ? "" : value; // Deseleccionar si ya está seleccionado
    onSelect(newValue);
    setOpen(false); // Cerrar el popover
    console.log("Valor seleccionado:", newValue);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    const selectedOption = options.find(
      (option) => option.value === selectedValues[0]
    );
    return selectedOption
      ? `${isMax ? "Hasta" : "Desde"} ${selectedOption.label}`
      : placeholder;
  };

  const CommandContent = () => (
    <Command>
      <CommandInput placeholder={placeholder} className="h-9" />
      <CommandList>
        <CommandEmpty>No se encontraron opciones.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={() => handleSelect(option.value)}
              className="flex justify-between items-center"
            >
              <span>{option.label}</span>
              <CheckIcon
                className={cn(
                  "h-4 w-4",
                  selectedValues[0] === option.value
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[300px] justify-between text-muted-foreground"
          >
            <p className="truncate">{getDisplayText()}</p>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[100dvh] max-h-[100dvh]">
          <SheetHeader>
            <SheetTitle>{placeholder}</SheetTitle>
            <SheetDescription>
              Selecciona las opciones que desees.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 h-full">
            <CommandContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between text-muted-foreground"
        >
          <p className="truncate">{getDisplayText()}</p>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <CommandContent />
      </PopoverContent>
    </Popover>
  );
}
